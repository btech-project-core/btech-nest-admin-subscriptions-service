import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionsDesigneSetting } from 'src/subscriptions-designe-settings/entities/subscriptions-designe-setting.entity';
import { SubscriptionDetail } from './subscription-detail.entity';

@Entity({ name: 'subscriptionsBussine' })
export class SubscriptionsBussine {
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

  @OneToOne(
    () => SubscriptionsDesigneSetting,
    (subscriptionsDesigneSetting) =>
      subscriptionsDesigneSetting.subscriptionsBussine,
  )
  subscriptionsDesigneSetting: SubscriptionsDesigneSetting;
}
