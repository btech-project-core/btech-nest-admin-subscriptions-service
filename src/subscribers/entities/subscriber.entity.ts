import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriberRole } from './subscriber-role.entity';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Entity()
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

  @ManyToOne(() => Subscription, (subscription) => subscription.subscriber)
  subscription: Subscription;

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
  token?: string | null;

  @Column({
    type: 'varchar',
    length: 62,
    nullable: true,
  })
  refreshToken: string;

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
    () => SubscriberRole,
    (subscriberRole) => subscriberRole.subscriber,
  )
  subscriberRoles: SubscriberRole[];
}
