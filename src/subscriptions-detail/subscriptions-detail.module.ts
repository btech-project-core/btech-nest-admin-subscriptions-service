import { Module } from '@nestjs/common';
import { SubscriptionsDetailController } from './subscriptions-detail.controller';
import { SubscriptionDetail } from './entities/subscription-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetailFeatures } from './entities/subscription-detail-features.entity';
import { SubscriptionsDetailService } from './services/subscriptions-detail.service';
import { SubscriptionsDetailFeaturesService } from './services/subscriptions-detail-features.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionDetail, SubscriptionDetailFeatures]),
  ],
  controllers: [SubscriptionsDetailController],
  providers: [SubscriptionsDetailService, SubscriptionsDetailFeaturesService],
  exports: [SubscriptionsDetailService],
})
export class SubscriptionsDetailModule {}
