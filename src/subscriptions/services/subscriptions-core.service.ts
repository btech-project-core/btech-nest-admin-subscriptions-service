import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionDto,
  FindAllSubscriptionResponseDto,
} from '../dto/find-all-subscription.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { TransactionService } from 'src/common/services/transaction.service';
import { SubscriptionsValidateService } from './subscriptions-validate.service';
import { SubscriptionsCustomService } from './subscriptions-custom.service';
import { SubscriptionsBulkService } from './subscriptions-bulk.service';

@Injectable()
export class SubscriptionsCoreService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionsValidateService: SubscriptionsValidateService,
    private readonly subscriptionsCustomService: SubscriptionsCustomService,
    private readonly subscriptionsBulkService: SubscriptionsBulkService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    this.subscriptionsValidateService.validateCorporateSubscription(
      createSubscriptionDto,
    );
    const subscription = await this.transactionService.runInTransaction(
      async (qr) => {
        const validatedEntities =
          await this.subscriptionsValidateService.validateAllRequiredEntities(
            createSubscriptionDto,
          );
        await this.subscriptionsValidateService.validateDuplicateAndOverlap(
          createSubscriptionDto,
          qr,
        );
        const subscription =
          await this.subscriptionsCustomService.createSubscription(
            createSubscriptionDto,
            qr,
          );
        await this.subscriptionsCustomService.createSubscriptionsBussine(
          createSubscriptionDto,
          subscription,
          validatedEntities.subscriptionsServices,
          qr,
        );
        return subscription;
      },
    );
    return this.subscriptionsBulkService.findOneWithCreateResponse(
      subscription.subscriptionId,
    );
  }

  async findAll(
    findAllSubscriptionDto: FindAllSubscriptionDto,
  ): Promise<PaginationResponseDto<Subscription>> {
    const {
      page = 1,
      limit = 8,
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
    return await paginateQueryBuilder(queryBuilder, {
      page,
      limit,
    });
  }
}
