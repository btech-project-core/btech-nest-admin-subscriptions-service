import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionsBussine } from './subscriptions-bussine.entity';

@Entity({ name: 'subscriptionDetail' })
export class SubscriptionDetail extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionDetailId: string;

  @ManyToOne(
    () => SubscriptionsBussine,
    (subscription) => subscription.subscriptionDetail,
  )
  @JoinColumn({ name: 'subscriptionsBussineId' })
  subscriptionsBussine: SubscriptionsBussine;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  serviceId: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  accountsNumber: number;
}
