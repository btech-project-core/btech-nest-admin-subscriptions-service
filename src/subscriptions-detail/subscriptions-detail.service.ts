import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionDetail } from './entities/subscription-detail.entity';
import { Repository } from 'typeorm';
import { FindActiveSubscriptionDetailsByBussinesIdResponseDto } from './dto/find-active-subscription-details-by-bussines-id.dto';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';

@Injectable()
export class SubscriptionsDetailService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionsDetailsRepository: Repository<SubscriptionDetail>,
  ) {}
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
