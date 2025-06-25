import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionDetail } from '../entities/subscription-detail.entity';

@Injectable()
export class SubscriptionsDetailsService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionsDetailsRepository: Repository<SubscriptionDetail>,
  ) {}
  async findBySubscriptionsBussineId(
    subscriptionBussineId: string,
  ): Promise<SubscriptionDetail[]> {
    const subscriptionDetails = await this.subscriptionsDetailsRepository.find({
      where: {
        subscriptionsBussine: { subscriptionBussineId },
      },
    });
    return subscriptionDetails;
  }
}
