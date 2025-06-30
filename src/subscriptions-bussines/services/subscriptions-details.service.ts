import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionDetail } from '../entities/subscription-detail.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { FindActiveSubscriptionDetailsByBussinesIdResponseDto } from '../dto/find-active-subscription-details-by-bussines-id.dto';

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

  async findActiveSubscriptionDetailsByBussinesId(
    subscriptionBussineId: string,
  ): Promise<FindActiveSubscriptionDetailsByBussinesIdResponseDto[]> {
    return await this.subscriptionsDetailsRepository
      .createQueryBuilder('sd')
      .innerJoin('sd.subscriptionsBussine', 'sb')
      .innerJoin('sb.subscription', 's')
      .select(['sd.subscriptionDetailId', 'sd.serviceId'])
      .where('sb.subscriptionBussineId = :subscriptionBussineId', {
        subscriptionBussineId,
      })
      .andWhere('s.status = :status', { status: StatusSubscription.ACTIVE })
      .getMany();
  }
}
