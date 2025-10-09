import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberDesignePreference } from './entities/subscriber-designe-preference.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
import { SubscriberDesignePreferenceController } from './subscriber-designe-preference.controller';
import { SubscriberDesignePreferenceService } from './services/subscriber-designe-preference.service';
import { SubscriberDesignePreferenceCoreService } from './services/subscriber-designe-preference-core.service';
import { SubscriberDesignePreferenceValidateService } from './services/subscriber-designe-preference-validate.service';
import { SubscribersModule } from 'src/subscribers/subscribers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriberDesignePreference,
      Subscriber,
      SubscriptionDetailDesigneMode,
    ]),
    SubscribersModule,
  ],
  controllers: [SubscriberDesignePreferenceController],
  providers: [
    SubscriberDesignePreferenceService,
    SubscriberDesignePreferenceCoreService,
    SubscriberDesignePreferenceValidateService,
  ],
  exports: [SubscriberDesignePreferenceService],
})
export class SubscriberDesignePreferenceModule {}
