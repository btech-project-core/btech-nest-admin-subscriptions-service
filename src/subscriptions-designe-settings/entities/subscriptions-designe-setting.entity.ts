import { Timestamped } from 'src/common/entities/timestamped.entity';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'subscriptionsDesigneSetting' })
export class SubscriptionsDesigneSetting extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionsDesigneSettingId: string;

  @ManyToOne(
    () => SubscriptionDetail,
    (subscription) => subscription.subscriptionsDesigneSetting,
  )
  @JoinColumn({ name: 'subscriptionDetailId' })
  subscriptionDetail: SubscriptionDetail;

  @ManyToOne(
    () => DesignerMode,
    (designerMode) => designerMode.subscriptionsDesigneSetting,
  )
  @JoinColumn({ name: 'designerModeId' })
  designerMode: DesignerMode;

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
