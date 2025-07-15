import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { Timestamped } from 'src/common/entities/timestamped.entity';

@Entity({ name: 'subscriptionsBussine' })
export class SubscriptionsBussine extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionBussineId: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  personId: string;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.subscriptionsBussine,
  )
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @OneToMany(() => Subscriber, (subscriber) => subscriber.subscriptionsBussine)
  subscriber: Subscriber[];

  @OneToMany(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.subscriptionsBussine,
  )
  subscriptionDetail: SubscriptionDetail[];

  @Column({
    type: 'integer',
    nullable: false,
  })
  numberAccounts: number;
}
