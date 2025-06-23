import { Timestamped } from 'src/common/entities/timestamped.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StatusSubscription } from '../enums/status-subscription.enum';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';

@Entity({ name: 'subscription' })
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
    type: 'varchar',
    length: 55,
    nullable: true,
  })
  url?: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  personId: string;

  @ManyToOne(
    () => SubscriptionsType,
    (subscriptionsType) => subscriptionsType.subscriptions,
  )
  @JoinColumn({ name: 'subscriptionTypeId' })
  subscriptionType: SubscriptionsType;

  @OneToMany(
    () => SubscriptionsBussine,
    (subscriptionsBussine) => subscriptionsBussine.subscription,
  )
  subscriptionsBussine: SubscriptionsBussine[];

  @Column({
    type: 'enum',
    enum: StatusSubscription,
    nullable: false,
  })
  status: StatusSubscription;
}
