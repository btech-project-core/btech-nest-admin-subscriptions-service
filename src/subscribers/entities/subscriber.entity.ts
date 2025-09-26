import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscribersSubscriptionDetail } from 'src/subscribers-subscription-detail/entities/subscribers-subscription-detail.entity';

@Entity({ name: 'subscriber' })
@Unique('UQ_subscriber_naturalperson_business', [
  'subscriptionsBussine',
  'naturalPersonId',
])
@Unique('UQ_subscriber_username_business', ['subscriptionsBussine', 'username'])
export class Subscriber extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriberId: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 62,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  naturalPersonId: string;

  @ManyToOne(
    () => SubscriptionsBussine,
    (subscription) => subscription.subscriber,
  )
  @JoinColumn({ name: 'subscriptionsBussineId' })
  subscriptionsBussine: SubscriptionsBussine;

  @Column({
    type: 'boolean',
    default: false,
  })
  isConfirm: boolean;

  @Column({
    type: 'varchar',
    length: 62,
    nullable: true,
  })
  token?: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  timeInactive?: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  twoFactorSecret: string | null;

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled: boolean;

  @OneToMany(
    () => SubscribersSubscriptionDetail,
    (subscribersSubscriptionDetail) => subscribersSubscriptionDetail.subscriber,
  )
  subscribersSubscriptionDetails: SubscribersSubscriptionDetail[];
}
