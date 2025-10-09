import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
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
  subscriptionsDesigneSettingId: string;

  @OneToOne(
    () => SubscriptionDetailDesigneMode,
    (subscriptionDetailDesigneMode) =>
      subscriptionDetailDesigneMode.subscriptionsDesigneSetting,
  )
  @JoinColumn({ name: 'subscriptionDetailDesigneModeId' })
  subscriptionDetailDesigneMode: SubscriptionDetailDesigneMode;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  url?: string;

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
  backgroundColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  surfaceColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  onPrimaryColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  onSecondaryColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  onBackgroundColor?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  onSurfaceColor?: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  letterFont?: string;
}
