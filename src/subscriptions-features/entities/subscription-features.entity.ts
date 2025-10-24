import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetailFeatures } from 'src/subscriptions-detail/entities/subscription-detail-features.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'subscriptionFeatures' })
@Unique(['code', 'subscriptionDetailId'])
@Unique(['description', 'subscriptionDetailId'])
export class SubscriptionFeatures extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionFeaturesId: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 65,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isRequired: boolean;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'global',
  })
  subscriptionDetailId: string;

  @OneToMany(
    () => SubscriptionDetailFeatures,
    (subscriptionDetailFeatures) =>
      subscriptionDetailFeatures.subscriptionFeatures,
  )
  subscriptionDetailFeatures: SubscriptionDetailFeatures[];
}
