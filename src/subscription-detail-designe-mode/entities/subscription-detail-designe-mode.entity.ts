import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import { SubscriptionsDesigneSetting } from 'src/subscriptions-designe-settings/entities/subscriptions-designe-setting.entity';

@Entity({ name: 'subscriptionDetailDesigneMode' })
@Unique('UQ_subscription_detail_designe_mode', [
  'subscriptionDetail',
  'designerMode',
])
@Index('IDX_subscription_detail_primary', ['subscriptionDetail', 'isPrimary'])
export class SubscriptionDetailDesigneMode extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriptionDetailDesigneModeId: string;

  @ManyToOne(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.subscriptionDetailDesigneModes,
  )
  @JoinColumn({ name: 'subscriptionDetailId' })
  subscriptionDetail: SubscriptionDetail;

  @ManyToOne(
    () => DesignerMode,
    (designerMode) => designerMode.subscriptionDetailDesigneModes,
  )
  @JoinColumn({ name: 'designerModeId' })
  designerMode: DesignerMode;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isPrimary: boolean;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @OneToOne(
    () => SubscriptionsDesigneSetting,
    (subscriptionsDesigneSetting) =>
      subscriptionsDesigneSetting.subscriptionDetailDesigneMode,
    { nullable: true },
  )
  subscriptionsDesigneSetting?: SubscriptionsDesigneSetting;
}
