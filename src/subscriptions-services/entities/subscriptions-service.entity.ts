import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'subscriptionsService' })
export class SubscriptionsService extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionsServiceId: string;

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

  @OneToMany(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.subscriptionsService,
  )
  subscriptionDetail: SubscriptionDetail[];

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
