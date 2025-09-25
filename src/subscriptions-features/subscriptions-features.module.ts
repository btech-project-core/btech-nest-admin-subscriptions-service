import { Module } from '@nestjs/common';
import { SubscriptionsFeaturesController } from './subscriptions-features.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionFeatures } from './entities/subscription-features.entity';
import { SubscriptionsFeaturesService } from './services/subscriptions-features.service';
import { SubscriptionsFeaturesValidateService } from './services/subscriptions-features-validate.service';
import { SubscriptionsFeaturesCustomService } from './services/subscriptions-features-custom.service';
import { SubscriptionsFeaturesCoreService } from './services/subscriptions-features-core.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionFeatures])],
  controllers: [SubscriptionsFeaturesController],
  providers: [
    SubscriptionsFeaturesService,
    SubscriptionsFeaturesCoreService,
    SubscriptionsFeaturesCustomService,
    SubscriptionsFeaturesValidateService,
  ],
})
export class SubscriptionsFeaturesModule {}
