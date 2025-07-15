import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionDetail } from './subscription-detail.entity';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionFeatures } from 'src/subscriptions-features/entities/subscription-features.entity';

@Entity({ name: 'subscriptionDetailFeatures' })
export class SubscriptionDetailFeatures extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionDetailFeaturesId: string;

  @ManyToOne(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.subscriptionDetailFeatures,
  )
  @JoinColumn({ name: 'subscriptionDetailId' })
  subscriptionDetail: SubscriptionDetail;

  @ManyToOne(
    () => SubscriptionFeatures,
    (subscriptionFeature) => subscriptionFeature.subscriptionDetailFeatures,
  )
  @JoinColumn({ name: 'subscriptionDetailFeatureId' })
  subscriptionFeatures: SubscriptionFeatures;

  @Column({
    type: 'varchar',
    length: 70,
    nullable: false,
  })
  value: string;
}
