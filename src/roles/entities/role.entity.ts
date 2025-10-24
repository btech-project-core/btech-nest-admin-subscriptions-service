import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriberRole } from 'src/subscribers/entities/subscriber-role.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RoleLevel } from '../enums/role-level.enum';

@Entity({ name: 'role' })
@Unique(['code', 'subscriptionBussineId'])
@Unique(['description', 'subscriptionBussineId'])
export class Role extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: RoleLevel,
    nullable: false,
    default: RoleLevel.SERVICE,
  })
  roleLevel: RoleLevel;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'global',
  })
  subscriptionBussineId: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => SubscriberRole, (subscriberRole) => subscriberRole.role)
  subscriberRoles: SubscriberRole[];
}
