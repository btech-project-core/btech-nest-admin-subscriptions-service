import { Module } from '@nestjs/common';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsCoreService } from './services/subscriptions-core.service';
import { SubscriptionsValidateService } from './services/subscriptions-validate.service';
import { SubscriptionsCustomService } from './services/subscriptions-custom.service';
import { SubscriptionsBulkService } from './services/subscriptions-bulk.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { CommonModule } from 'src/common/common.module';
import { SubscriptionsBussinesModule } from 'src/subscriptions-bussines/subscriptions-bussines.module';
import { SubscriptionsServicesModule } from 'src/subscriptions-services/subscriptions-services.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    CommonModule,
    SubscriptionsBussinesModule,
    SubscriptionsServicesModule,
    SubscribersModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsCoreService,
    SubscriptionsValidateService,
    SubscriptionsCustomService,
    SubscriptionsBulkService,
  ],
  exports: [SubscriptionsService, SubscriptionsValidateService],
})
export class SubscriptionsModule {}
