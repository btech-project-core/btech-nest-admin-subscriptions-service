import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class SubscriptionDetail extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionDetailId: string;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.subscriptionDetail,
  )
  subscription: Subscription;

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
