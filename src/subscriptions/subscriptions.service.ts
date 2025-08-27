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
import { formatSubscriptionBussineResponse } from './helpers/format-subscription-response.helper';
import { DocumentUsersService } from 'src/common/services/document-users.service';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { FindSubscriptionMultiplePersonDataResponseDto } from 'src/common/dto/find-subscription-multiple-person-data.dto';
import { StatusSubscription } from './enums/status-subscription.enum';
import { SubscriptionsServicesService } from 'src/subscriptions-services/subscriptions-services.service';
import { CreateSubscriptionsBussineDto } from 'src/subscriptions-bussines/dto/create-subscriptions-bussine.dto';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';

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
    private readonly subscribersService: SubscribersService,
  ) {}
  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    this.validateCorporateSubscription(createSubscriptionDto);
    const subscription = await this.transactionService.runInTransaction(
      async (qr) => {
        const validatedEntities = await this.validateAllRequiredEntities(
          createSubscriptionDto,
        );
        await this.validateDuplicateAndOverlap(createSubscriptionDto, qr);
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
      },
    );
    return this.findOneWithCreateResponse(subscription.subscriptionId);
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
    const queryBuilder = this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.subscriptionsBussine',
        'subscriptionsBussine',
      );
    if (status)
      queryBuilder.andWhere('subscription.status = :status', { status });
    if (startDate)
      queryBuilder.andWhere('subscription.initialDate >= :startDate', {
        startDate,
      });
    if (endDate)
      queryBuilder.andWhere('subscription.initialDate <= :endDate', {
        endDate,
      });
    queryBuilder.orderBy('subscription.createdAt', 'DESC');
    const subscriptionsList = await paginateQueryBuilder(queryBuilder, {
      page,
      limit,
    });

    const allSubscriptionsBussine = subscriptionsList.data.flatMap(
      (subscription) =>
        (subscription.subscriptionsBussine || []).map((subscriptionBussine) => {
          subscriptionBussine.subscription = subscription;
          return subscriptionBussine;
        }),
    );

    const subscriptionsWithPersonData =
      await this.formatSubscriptionsBussineWithPersonData(
        allSubscriptionsBussine,
        term,
      );

    return {
      data: subscriptionsWithPersonData,
      total: term
        ? subscriptionsWithPersonData.length
        : allSubscriptionsBussine.length,
      page,
      limit,
      totalPages: Math.ceil(
        (term
          ? subscriptionsWithPersonData.length
          : allSubscriptionsBussine.length) / limit,
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
    const { initialDate, finalDate, contractSigningDate } =
      createSubscriptionDto;
    validateSubscriptionDates(initialDate, finalDate, contractSigningDate);
    // Calcular el estado basado en las fechas
    const calculatedStatus = this.calculateSubscriptionStatus(initialDate);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;

    const subscription = repository.create({
      ...createSubscriptionDto,
      status: calculatedStatus,
    });

    await repository.save(subscription);
    return subscription;
  }

  private calculateSubscriptionStatus(initialDate: string): StatusSubscription {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(initialDate);
    startDate.setHours(0, 0, 0, 0);
    if (startDate <= today) return StatusSubscription.ACTIVE;
    return StatusSubscription.PENDING;
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
    const { modality, personId, subscriptionsBusiness } = createSubscriptionDto;

    if (modality === ModalitySubscription.CORPORATE) {
      // Para modalidad corporativa, crear cada business y sus subscribers
      for (const dto of subscriptionsBusiness) {
        const subscriptionsBussine =
          await this.subscriptionsBussinesService.create(
            subscription,
            dto,
            subscriptionsServices,
            queryRunner,
          );

        // Crear subscribers para las personas naturales especificadas
        if (dto.naturalPersons && dto.naturalPersons.length > 0) {
          await this.subscribersService.createSubscribersForNaturalPersons(
            dto.naturalPersons,
            subscriptionsBussine,
            queryRunner,
          );
        }
      }
    } else {
      // Para modalidad no corporativa
      const businessDto = subscriptionsBusiness[0];
      const subscriptionsBussine =
        await this.subscriptionsBussinesService.create(
          subscription,
          {
            personId,
            subscriptionDetails: businessDto.subscriptionDetails,
          },
          subscriptionsServices,
          queryRunner,
        );

      // Crear subscribers si se proporcionaron naturalPersons
      if (businessDto.naturalPersons && businessDto.naturalPersons.length > 0) {
        await this.subscribersService.createSubscribersForNaturalPersons(
          businessDto.naturalPersons,
          subscriptionsBussine,
          queryRunner,
        );
      }
    }
  }

  private async validateAllRequiredEntities(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ subscriptionsServices: any[] }> {
    const { subscriptionsBusiness } = createSubscriptionDto;
    this.validateUniqueSubscriptionServices(subscriptionsBusiness);
    const allServiceIds = this.extractAllServiceIds(subscriptionsBusiness);
    const allPersonIds = this.extractAllPersonIds(createSubscriptionDto);
    const subscriptionsServices =
      await this.subscriptionsServicesService.validateSubscriptionServicesExist(
        allServiceIds,
      );
    if (allPersonIds.length > 0)
      await this.adminPersonsService.validatePersonsExist(allPersonIds);

    return { subscriptionsServices };
  }

  private async validateDuplicateAndOverlap(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const { personId, initialDate, finalDate } = createSubscriptionDto;
    // Solo validar solapamiento de fechas - permitir múltiples suscripciones si no se solapan
    await this.validateNoDateOverlap(
      personId,
      initialDate,
      finalDate,
      queryRunner,
    );
  }

  private async validateNoDateOverlap(
    personId: string,
    initialDate: string,
    finalDate: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;

    const startDate = new Date(initialDate);
    const endDate = new Date(finalDate);
    const overlappingSubscriptions = await repository
      .createQueryBuilder('subscription')
      .where('subscription.personId = :personId', { personId })
      .andWhere('subscription.status IN (:...statuses)', {
        statuses: [StatusSubscription.ACTIVE, StatusSubscription.PENDING],
      })
      .andWhere('subscription.initialDate <= :endDate', { endDate })
      .andWhere('subscription.finalDate >= :startDate', { startDate })
      .getCount();

    if (overlappingSubscriptions > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede crear la suscripción porque las fechas se solapan con ${overlappingSubscriptions} suscripción(es) existente(s) para esta persona`,
      });
  }

  private validateUniqueSubscriptionServices(
    subscriptionsBusiness: CreateSubscriptionsBussineDto[],
  ): void {
    const allServiceIds: string[] = [];
    subscriptionsBusiness.forEach((business) => {
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
    subscriptionsBusiness: CreateSubscriptionsBussineDto[],
  ): string[] {
    const serviceIds: string[] = [];
    subscriptionsBusiness.forEach((business) => {
      business.subscriptionDetails.forEach((detail) => {
        serviceIds.push(detail.subscriptionServiceId);
      });
    });
    return [...new Set(serviceIds)];
  }

  private extractAllPersonIds(
    createSubscriptionDto: CreateSubscriptionDto,
  ): string[] {
    const { modality, personId, subscriptionsBusiness } = createSubscriptionDto;
    const personIds: string[] = [personId]; // PersonId principal

    if (modality === ModalitySubscription.CORPORATE) {
      subscriptionsBusiness.forEach((business) => {
        if (business.personId) {
          personIds.push(business.personId);
        }
      });
    }

    return [...new Set(personIds.filter(Boolean))];
  }

  private async formatSubscriptionsBussineWithPersonData(
    subscriptionsBussineList: SubscriptionsBussine[],
    term?: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    const personIds = subscriptionsBussineList.map(
      (subscriptionBussine) => subscriptionBussine.personId,
    );

    let personsData: FindSubscriptionMultiplePersonDataResponseDto[] = [];
    if (personIds.length > 0) {
      personsData =
        await this.adminPersonsService.findMultipleSubscriptionPersonData({
          personIds,
        });
    }

    const personsMap = new Map(
      personsData.map((person) => [person.personId, person]),
    );

    const formattedData = subscriptionsBussineList
      .map((subscriptionBussine) => {
        const person = personsMap.get(subscriptionBussine.personId);
        return formatSubscriptionBussineResponse(
          subscriptionBussine,
          person,
          term,
        );
      })
      .filter((item) => item !== null);

    return formattedData;
  }

  private validateCorporateSubscription = (
    createSubscriptionDto: CreateSubscriptionDto,
  ): void => {
    const { modality, subscriptionsBusiness } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      if (!subscriptionsBusiness || subscriptionsBusiness.length === 0)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad corporativa se requiere al menos un subscription business',
        });
      subscriptionsBusiness.forEach((business) => {
        if (!business.personId)
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            message:
              'Para modalidad corporativa, cada subscription business debe tener un personId',
          });
      });
    } else {
      if (subscriptionsBusiness.length !== 1)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad no corporativa se requiere exactamente un subscription business',
        });
    }
  };

  private async findOneWithCreateResponse(
    subscriptionId: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    const createdSubscription = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .where('subscription.subscriptionId = :subscriptionId', {
        subscriptionId,
      })
      .getOne();

    if (!createdSubscription)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'No se ha encontrado la suscripción',
      });
    // Extraer subscriptionsBussine con referencia a subscription
    const subscriptionsBussineList = (
      createdSubscription.subscriptionsBussine || []
    ).map((subscriptionBussine) => {
      subscriptionBussine.subscription = createdSubscription;
      return subscriptionBussine;
    });

    return await this.formatSubscriptionsBussineWithPersonData(
      subscriptionsBussineList,
    );
  }
}
