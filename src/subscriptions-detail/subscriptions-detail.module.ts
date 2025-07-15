import { Module } from '@nestjs/common';
import { SubscriptionsDetailService } from './subscriptions-detail.service';
import { SubscriptionsDetailController } from './subscriptions-detail.controller';
import { SubscriptionDetail } from './entities/subscription-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetailFeatures } from './entities/subscription-detail-features.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionDetail, SubscriptionDetailFeatures]),
  ],
  controllers: [SubscriptionsDetailController],
  providers: [SubscriptionsDetailService],
})
export class SubscriptionsDetailModule {}
