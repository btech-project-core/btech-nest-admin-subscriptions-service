import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionsDetailController } from './subscriptions-detail.controller';
import { SubscriptionDetail } from './entities/subscription-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetailFeatures } from './entities/subscription-detail-features.entity';
import { SubscriptionsDetailService } from './services/subscriptions-detail.service';
import { SubscriptionsDetailFeaturesService } from './services/subscriptions-detail-features.service';
import { SubscriptionsBussinesModule } from 'src/subscriptions-bussines/subscriptions-bussines.module';
import { SubscriptionsServicesModule } from 'src/subscriptions-services/subscriptions-services.module';
import { SubscriptionsDetailCoreService } from './services/subscriptions-detail-core.service';
import { SubscriptionsDetailCustomService } from './services/subscriptions-detail-custom.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionDetail, SubscriptionDetailFeatures]),
    forwardRef(() => SubscriptionsBussinesModule),
    SubscriptionsServicesModule,
  ],
  controllers: [SubscriptionsDetailController],
  providers: [
    SubscriptionsDetailService,
    SubscriptionsDetailFeaturesService,
    SubscriptionsDetailCoreService,
    SubscriptionsDetailCustomService,
  ],
  exports: [
    SubscriptionsDetailService,
    SubscriptionsDetailCustomService,
    SubscriptionsDetailFeaturesService,
    SubscriptionsDetailFeaturesService,
  ],
})
export class SubscriptionsDetailModule {}
