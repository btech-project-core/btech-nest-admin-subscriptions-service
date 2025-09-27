import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionDetailFeatures } from '../entities/subscription-detail-features.entity';
import { Repository } from 'typeorm';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { CodeService } from 'src/common/enums/code-service.enum';
import { CodeFeatures } from 'src/common/enums/code-features.enum';
import { FindDomainsResponseDto } from '../dto/find-domains.dto';

@Injectable()
export class SubscriptionsDetailFeaturesService {
  constructor(
    @InjectRepository(SubscriptionDetailFeatures)
    private readonly subscriptionsDetailFeaturesRepository: Repository<SubscriptionDetailFeatures>,
  ) {}

  async findActiveDomains(
    service?: CodeService,
  ): Promise<FindDomainsResponseDto> {
    const queryBuilder = this.subscriptionsDetailFeaturesRepository
      .createQueryBuilder('subscriptionDetailFeatures')
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .where('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere('subscriptionFeatures.code= :codeFeature', {
        codeFeature: CodeFeatures.DOM,
      });
    if (service)
      queryBuilder
        .innerJoin(
          'subscriptionDetail.subscriptionsService',
          'subscriptionsService',
        )
        .andWhere('subscriptionsService.code = :service', {
          service,
        });
    const subscriptionDetailFeatures = await queryBuilder.getMany();
    const domains = subscriptionDetailFeatures.map((data) => data.value);
    return { domains };
  }

  async isAutoLogin(
    subscriberId: string,
    subscriptionDetailId: string,
    subscriptionBussineId: string,
  ): Promise<boolean> {
    const item = await this.subscriptionsDetailFeaturesRepository
      .createQueryBuilder('subscriptionDetailFeatures')
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin('subscriptionsBussine.subscriber', 'subscriber')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .where('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId,
        },
      )
      .andWhere(
        'subscriptionsBussine.subscriptionBussineId = :subscriptionBussineId',
        {
          subscriptionBussineId,
        },
      )
      .andWhere('subscriber.subscriberId = :subscriberId', {
        subscriberId,
      })
      .andWhere('subscriptionFeatures.code= :codeFeature', {
        codeFeature: CodeFeatures.AULOG,
      })
      .getOne();
    if (item && item.value === '1') return true;
    return false;
  }
}
