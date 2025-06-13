import { Timestamped } from 'src/common/entities/timestamped.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SubscriptionsDesigneSetting } from '../../subscriptions-designe-settings/entities/subscriptions-designe-setting.entity';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { SubscriptionDetail } from './subscriptionDetail.entity';
import { StatusSubscription } from '../enums/status-subscription.enum';

@Entity()
export class Subscription extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionId: string;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  initialDate: Date;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  finalDate: Date;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  contractSigningDate: Date;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  personId: string;

  @ManyToOne(
    () => SubscriptionsType,
    (subscriptionsType) => subscriptionsType.subscriptions,
  )
  subscriptionType: SubscriptionsType;

  @OneToMany(() => Subscriber, (subscriber) => subscriber.subscription)
  subscriber: Subscriber[];

  @OneToMany(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.subscription,
  )
  subscriptionDetail: SubscriptionDetail[];

  @OneToOne(
    () => SubscriptionsDesigneSetting,
    (subscriptionsDesigneSetting) => subscriptionsDesigneSetting.subscription,
  )
  subscriptionsDesigneSetting: SubscriptionsDesigneSetting;

  @Column({
    type: 'enum',
    enum: StatusSubscription,
    nullable: false,
  })
  status: StatusSubscription;
}
