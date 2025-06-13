import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubscriptionsDesigneSetting extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscribersDesigneSettingId: string;

  @OneToOne(
    () => Subscription,
    (subscription) => subscription.subscriptionsDesigneSetting,
  )
  @JoinColumn()
  subscription: Subscription;

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
