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

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly documentUsersService: DocumentUsersService,
  ) {}
  create(createSubscriptionDto: CreateSubscriptionDto) {
    this.validateCorporateSubscription(createSubscriptionDto);
    this.transactionService.runInTransaction(async (qr) => {
      const subscription = await this.createSubscription(
        createSubscriptionDto,
        qr,
      );
      await this.createSubscriptionsBussine(
        createSubscriptionDto,
        subscription.subscriptionId,
        qr,
      );
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
    subscriptionId: string,
    queryRunner?: QueryRunner,
  ) {
    const { modality, personId, createSubscriptionsBussineDto } =
      createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE)
      await Promise.all(
        createSubscriptionsBussineDto!.map((dto) =>
          this.subscriptionsBussinesService.create(dto, queryRunner),
        ),
      );
    if (modality !== ModalitySubscription.CORPORATE)
      await this.subscriptionsBussinesService.create(
        {
          subscriptionId,
          personId,
        },
        queryRunner,
      );
  }

  private validateCorporateSubscription = (
    createSubscriptionDto: CreateSubscriptionDto,
  ): void => {
    const { modality, createSubscriptionsBussineDto } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      if (
        !createSubscriptionsBussineDto ||
        createSubscriptionsBussineDto.length === 0
      )
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad corporativa se requiere al menos un subscription business',
        });
    }
  };
}
