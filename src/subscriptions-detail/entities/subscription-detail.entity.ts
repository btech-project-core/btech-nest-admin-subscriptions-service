import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionDetailFeatures } from './subscription-detail-features.entity';
import { SubscriptionsDesigneSetting } from 'src/subscriptions-designe-settings/entities/subscriptions-designe-setting.entity';

@Entity({ name: 'subscriptionDetail' })
export class SubscriptionDetail extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionDetailId: string;

  @ManyToOne(
    () => SubscriptionsBussine,
    (subscription) => subscription.subscriptionDetail,
  )
  @JoinColumn({ name: 'subscriptionsBussineId' })
  subscriptionsBussine: SubscriptionsBussine;

  @ManyToOne(
    () => SubscriptionsService,
    (subscription) => subscription.subscriptionDetail,
  )
  @JoinColumn({ name: 'subscriberServiceId' })
  subscriptionsService: SubscriptionsService;

  @OneToMany(
    () => SubscriptionDetailFeatures,
    (subscriptionDetailFeatures) =>
      subscriptionDetailFeatures.subscriptionDetail,
  )
  subscriptionDetailFeatures: SubscriptionDetailFeatures[];

  @OneToMany(
    () => SubscriptionsDesigneSetting,
    (subscriptionsDesigneSetting) =>
      subscriptionsDesigneSetting.subscriptionDetail,
  )
  subscriptionsDesigneSetting: SubscriptionsDesigneSetting[];
}
