import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscribersSubscriptionDetail } from '../entities/subscribers-subscription-detail.entity';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';
import { SubscriptionDetail } from '../../subscriptions-detail/entities/subscription-detail.entity';

@Injectable()
export class SubscribersSubscriptionDetailCoreService {
  constructor(
    @InjectRepository(SubscribersSubscriptionDetail)
    private readonly subscribersSubscriptionDetailRepository: Repository<SubscribersSubscriptionDetail>,
  ) {}

  async create(
    subscriber: Subscriber,
    subscriptionDetail: SubscriptionDetail,
    isActive: boolean = true,
  ): Promise<SubscribersSubscriptionDetail> {
    const subscribersSubscriptionDetail =
      this.subscribersSubscriptionDetailRepository.create({
        subscriber,
        subscriptionDetail,
        isActive,
      });
    return await this.subscribersSubscriptionDetailRepository.save(
      subscribersSubscriptionDetail,
    );
  }
}
