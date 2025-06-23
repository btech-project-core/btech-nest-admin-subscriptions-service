import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subscriber } from './subscriber.entity';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Role } from 'src/roles/entities/role.entity';

@Entity({ name: 'subscriberRole' })
export class SubscriberRole extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriberRoleId: string;

  @ManyToOne(() => Subscriber, (subscriber) => subscriber.subscriberRoles)
  @JoinColumn({ name: 'subscriberId' })
  subscriber: Subscriber;

  @ManyToOne(() => Role, (role) => role.subscriberRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
