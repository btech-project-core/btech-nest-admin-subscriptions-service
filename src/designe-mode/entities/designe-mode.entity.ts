import { Timestamped } from 'src/common/entities/timestamped.entity';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'designerMode' })
export class DesignerMode extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  designerModeId: string;

  @Column({
    type: 'varchar',
    length: 65,
    nullable: false,
    unique: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    () => SubscriptionDetailDesigneMode,
    (subscriptionDetailDesigneMode) =>
      subscriptionDetailDesigneMode.designerMode,
  )
  subscriptionDetailDesigneModes: SubscriptionDetailDesigneMode[];
}
