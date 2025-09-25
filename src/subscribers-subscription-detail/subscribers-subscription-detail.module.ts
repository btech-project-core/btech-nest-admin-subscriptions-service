import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersSubscriptionDetail } from './entities/subscribers-subscription-detail.entity';
import { SubscribersSubscriptionDetailService } from './services/subscribers-subscription-detail.service';
import { SubscribersSubscriptionDetailCoreService } from './services/subscribers-subscription-detail-core.service';
import { SubscribersSubscriptionDetailValidateService } from './services/subscribers-subscription-detail-validate.service';
import { SubscribersSubscriptionDetailCustomService } from './services/subscribers-subscription-detail-custom.service';
import { SubscribersSubscriptionDetailController } from './subscribers-subscription-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribersSubscriptionDetail])],
  controllers: [SubscribersSubscriptionDetailController],
  providers: [
    SubscribersSubscriptionDetailService,
    SubscribersSubscriptionDetailCoreService,
    SubscribersSubscriptionDetailValidateService,
    SubscribersSubscriptionDetailCustomService,
  ],
  exports: [
    SubscribersSubscriptionDetailService,
    SubscribersSubscriptionDetailValidateService,
    SubscribersSubscriptionDetailCustomService,
    SubscribersSubscriptionDetailCoreService,
  ],
})
export class SubscribersSubscriptionDetailModule {}
