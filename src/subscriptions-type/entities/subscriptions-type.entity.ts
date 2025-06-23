import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'subscriptionsType' })
export class SubscriptionsType extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionTypeId: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  description: string;

  @OneToMany(
    () => Subscription,
    (subscription) => subscription.subscriptionType,
  )
  subscriptions: Subscription[];

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
