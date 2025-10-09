import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';

@Entity({ name: 'subscriberDesignePreference' })
@Unique('UQ_subscriber_preference', ['subscriber'])
export class SubscriberDesignePreference extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  subscriberDesignePreferenceId: string;

  @OneToOne(
    () => Subscriber,
    (subscriber) => subscriber.subscriberDesignePreference,
  )
  @JoinColumn({ name: 'subscriberId' })
  subscriber: Subscriber;

  @ManyToOne(() => SubscriptionDetailDesigneMode)
  @JoinColumn({ name: 'subscriptionDetailDesigneModeId' })
  subscriptionDetailDesigneMode: SubscriptionDetailDesigneMode;
}
