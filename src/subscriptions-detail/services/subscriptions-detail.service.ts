import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { SubscriptionDetail } from '../entities/subscription-detail.entity';
import { CreateSubscriptionDetailDto } from '../dto/create-subscription-detail.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionsDetailCoreService } from './subscriptions-detail-core.service';

@Injectable()
export class SubscriptionsDetailService {
  constructor(
    private readonly subscriptionsDetailCoreService: SubscriptionsDetailCoreService,
  ) {}
  async create(
    subscriptionsBussine: SubscriptionsBussine,
    createSubscriptionDetailsDto: CreateSubscriptionDetailDto[],
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ): Promise<SubscriptionDetail[]> {
    return this.subscriptionsDetailCoreService.create(
      subscriptionsBussine,
      createSubscriptionDetailsDto,
      subscriptionsServices,
      queryRunner,
    );
  }
}
