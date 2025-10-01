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
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { SubscriberRole } from 'src/subscribers/entities/subscriber-role.entity';

@Entity({ name: 'subscribersSubscriptionDetail' })
@Unique('UQ_subscribers_subscription_detail', [
  'subscriber',
  'subscriptionDetail',
])
export class SubscribersSubscriptionDetail extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscribersSubscriptionDetailId: string;

  @ManyToOne(
    () => Subscriber,
    (subscriber) => subscriber.subscribersSubscriptionDetails,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'subscriberId' })
  subscriber: Subscriber;

  @ManyToOne(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.subscribersSubscriptionDetails,
  )
  @JoinColumn({ name: 'subscriptionDetailId' })
  subscriptionDetail: SubscriptionDetail;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    () => SubscriberRole,
    (subscriberRole) => subscriberRole.subscribersSubscriptionDetail,
    { onDelete: 'CASCADE' },
  )
  subscriberRoles: SubscriberRole[];
}
