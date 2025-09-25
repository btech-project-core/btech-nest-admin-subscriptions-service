import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Role } from 'src/roles/entities/role.entity';
import { SubscribersSubscriptionDetail } from 'src/subscribers-subscription-detail/entities/subscribers-subscription-detail.entity';

@Entity({ name: 'subscriberRole' })
export class SubscriberRole extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriberRoleId: string;

  @ManyToOne(
    () => SubscribersSubscriptionDetail,
    (subscribersSubscriptionDetail) =>
      subscribersSubscriptionDetail.subscriberRoles,
  )
  @JoinColumn({ name: 'subscribersSubscriptionDetailId' })
  subscribersSubscriptionDetail: SubscribersSubscriptionDetail;

  @ManyToOne(() => Role, (role) => role.subscriberRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
