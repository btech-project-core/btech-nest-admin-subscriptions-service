import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'subscriptionsDesigneSetting' })
export class SubscriptionsDesigneSetting extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscribersDesigneSettingId: string;

  @OneToOne(
    () => SubscriptionsBussine,
    (subscription) => subscription.subscriptionsDesigneSetting,
  )
  @JoinColumn({ name: 'subscriptionsBussineId' })
  subscriptionsBussine: SubscriptionsBussine;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  brandOne?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  brandTwo?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  brandThree?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  brandFour?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  primaryColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  secondaryColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  baseColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  infoColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  warningColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  successColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  errorColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  lightColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  darkColor?: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  letterFont?: string;
}
