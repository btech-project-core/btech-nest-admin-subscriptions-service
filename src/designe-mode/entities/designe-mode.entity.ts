import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'designerMode' })
@Unique(['description', 'subscriptionDetailId'])
@Unique(['code', 'subscriptionDetailId'])
export class DesignerMode extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  designerModeId: string;

  @Column({
    type: 'varchar',
    length: 65,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'global',
  })
  subscriptionDetailId: string;

  @OneToMany(
    () => SubscriptionDetailDesigneMode,
    (subscriptionDetailDesigneMode) =>
      subscriptionDetailDesigneMode.designerMode,
  )
  subscriptionDetailDesigneModes: SubscriptionDetailDesigneMode[];
}
