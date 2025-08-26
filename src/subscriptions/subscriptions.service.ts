import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { validateSubscriptionDates } from './helpers/validate-subscription-dates.helper';
import { TransactionService } from 'src/common/services/transaction.service';
import { SubscriptionsBussinesService } from 'src/subscriptions-bussines/subscriptions-bussines.service';
import { ModalitySubscription } from './enums/modality-subscription.enum';
import { RpcException } from '@nestjs/microservices';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionDto,
  FindAllSubscriptionResponseDto,
} from './dto/find-all-subscription.dto';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { formatSubscriptionResponse } from './helpers/format-subscription-response.helper';
import { DocumentUsersService } from 'src/common/services/document-users.service';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { FindSubscriptionMultiplePersonDataResponseDto } from 'src/common/dto/find-subscription-multiple-person-data.dto';
import { StatusSubscription } from './enums/status-subscription.enum';
import { SubscriptionsServicesService } from 'src/subscriptions-services/subscriptions-services.service';
import { CreateSubscriptionsBussineDto } from 'src/subscriptions-bussines/dto/create-subscriptions-bussine.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly documentUsersService: DocumentUsersService,
    private readonly subscriptionsServicesService: SubscriptionsServicesService,
  ) {}
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    this.validateCorporateSubscription(createSubscriptionDto);
    const validatedEntities = await this.validateAllRequiredEntities(
      createSubscriptionDto,
    );
    return this.transactionService.runInTransaction(async (qr) => {
      const subscription = await this.createSubscription(
        createSubscriptionDto,
        qr,
      );
      await this.createSubscriptionsBussine(
        createSubscriptionDto,
        subscription,
        validatedEntities.subscriptionsServices,
        qr,
      );
      return subscription;
    });
  }

  async findAll(
    findAllSubscriptionDto: FindAllSubscriptionDto,
  ): Promise<PaginationResponseDto<FindAllSubscriptionResponseDto>> {
    const {
      page = 1,
      limit = 8,
      term,
      status,
      startDate,
      endDate,
    } = findAllSubscriptionDto;
    const queryBuilder =
      this.subscriptionsRepository.createQueryBuilder('subscription');
    if (status)
      queryBuilder.andWhere('subscription.status = :status', {
        status,
      });
    if (startDate)
      queryBuilder.andWhere('subscription.initialDate >= :startDate', {
        startDate,
      });
    if (endDate)
      queryBuilder.andWhere('subscription.initialDate <= :endDate', {
        endDate,
      });
    queryBuilder.orderBy('subscription.createdAt', 'DESC');
    const subscriptionList = await paginateQueryBuilder(queryBuilder, {
      page,
      limit,
    });
    const personIds = subscriptionList.data.map(
      (subscription) => subscription.personId,
    );
    let personsData: FindSubscriptionMultiplePersonDataResponseDto[] = [];
    if (personIds.length > 0)
      personsData =
        await this.adminPersonsService.findMultipleSubscriptionPersonData({
          personIds,
        });
    const personsMap = new Map(
      personsData.map((person) => [person.personId, person]),
    );
    const subscriptionsWithPersonData = subscriptionList.data
      .map((subscription) => {
        const person = personsMap.get(subscription.personId);
        return formatSubscriptionResponse(subscription, person, term);
      })
      .filter((item) => item !== null);
    return {
      data: subscriptionsWithPersonData,
      total: term ? subscriptionsWithPersonData.length : subscriptionList.total,
      page,
      limit,
      totalPages: Math.ceil(
        (term ? subscriptionsWithPersonData.length : subscriptionList.total) /
          limit,
      ),
    };
  }

  async validateUsersWithSubscription(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    return await this.documentUsersService.validateUserDocument(file);
  }

  private async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ) {
    const { initialDate, finalDate } = createSubscriptionDto;
    validateSubscriptionDates(initialDate, finalDate);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;
    const subscription = repository.create(createSubscriptionDto);
    await repository.save(subscription);
    return subscription;
  }

  async checkActiveSubscriptionsByPersonId(personId: string): Promise<boolean> {
    const activeSubscriptionsCount = await this.subscriptionsRepository.count({
      where: {
        personId,
        status: StatusSubscription.ACTIVE,
      },
    });
    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede proceder porque la persona tiene ${activeSubscriptionsCount} suscripción(es) activa(s)`,
      });
    return true;
  }

  private async createSubscriptionsBussine(
    createSubscriptionDto: CreateSubscriptionDto,
    subscription: Subscription,
    subscriptionsServices: any[],
    queryRunner?: QueryRunner,
  ) {
    const { modality, personId, subscriptionsBussine } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      await Promise.all(
        subscriptionsBussine.map((dto) =>
          this.subscriptionsBussinesService.create(
            subscription,
            dto,
            subscriptionsServices,
            queryRunner,
          ),
        ),
      );
    } else {
      const businessDto = subscriptionsBussine[0];
      await this.subscriptionsBussinesService.create(
        subscription,
        {
          personId,
          subscriptionDetails: businessDto.subscriptionDetails,
        },
        subscriptionsServices,
        queryRunner,
      );
    }
  }

  private async validateAllRequiredEntities(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ subscriptionsServices: any[] }> {
    const { subscriptionsBussine } = createSubscriptionDto;

    // 1. Validar que no haya IDs de servicios duplicados
    this.validateUniqueSubscriptionServices(subscriptionsBussine);

    // 2. Obtener todos los IDs únicos para validaciones
    const allServiceIds = this.extractAllServiceIds(subscriptionsBussine);
    const allPersonIds = this.extractAllPersonIds(createSubscriptionDto);

    // 3. Validar que todos los servicios de suscripción existan y estén activos (retorna entidades)
    const subscriptionsServices =
      await this.subscriptionsServicesService.validateSubscriptionServicesExist(
        allServiceIds,
      );

    // 4. Validar que todas las personas existan
    if (allPersonIds.length > 0)
      await this.adminPersonsService.validatePersonsExist(allPersonIds);

    return { subscriptionsServices };
  }

  private validateUniqueSubscriptionServices(
    subscriptionsBussine: CreateSubscriptionsBussineDto[],
  ): void {
    const allServiceIds: string[] = [];
    subscriptionsBussine.forEach((business) => {
      business.subscriptionDetails.forEach((detail) => {
        allServiceIds.push(detail.subscriptionServiceId);
      });
    });

    const duplicateIds = allServiceIds.filter(
      (id, index) => allServiceIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Servicios de suscripción duplicados encontrados: ${[...new Set(duplicateIds)].join(', ')}`,
      });
  }

  private extractAllServiceIds(
    subscriptionsBussine: CreateSubscriptionsBussineDto[],
  ): string[] {
    const serviceIds: string[] = [];
    subscriptionsBussine.forEach((business) => {
      business.subscriptionDetails.forEach((detail) => {
        serviceIds.push(detail.subscriptionServiceId);
      });
    });
    return [...new Set(serviceIds)];
  }

  private extractAllPersonIds(
    createSubscriptionDto: CreateSubscriptionDto,
  ): string[] {
    const { modality, personId, subscriptionsBussine } = createSubscriptionDto;
    const personIds: string[] = [personId]; // PersonId principal

    if (modality === ModalitySubscription.CORPORATE) {
      subscriptionsBussine.forEach((business) => {
        if (business.personId) {
          personIds.push(business.personId);
        }
      });
    }

    return [...new Set(personIds.filter(Boolean))];
  }

  private validateCorporateSubscription = (
    createSubscriptionDto: CreateSubscriptionDto,
  ): void => {
    const { modality, subscriptionsBussine } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      if (!subscriptionsBussine || subscriptionsBussine.length === 0)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad corporativa se requiere al menos un subscription business',
        });
      subscriptionsBussine.forEach((business) => {
        if (!business.personId)
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            message:
              'Para modalidad corporativa, cada subscription business debe tener un personId',
          });
      });
    } else {
      if (subscriptionsBussine.length !== 1)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad no corporativa se requiere exactamente un subscription business',
        });
    }
  };
}
