import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetailFeatures } from 'src/subscriptions-detail/entities/subscription-detail-features.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'subscriptionFeatures' })
export class SubscriptionFeatures extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionFeaturesId: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
    unique: true,
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

  @OneToMany(
    () => SubscriptionDetailFeatures,
    (subscriptionDetailFeatures) =>
      subscriptionDetailFeatures.subscriptionFeatures,
  )
  subscriptionDetailFeatures: SubscriptionDetailFeatures[];
}
