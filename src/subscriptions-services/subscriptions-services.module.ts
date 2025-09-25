import { Module } from '@nestjs/common';
import { SubscriptionsServicesController } from './subscriptions-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './entities/subscriptions-service.entity';
import { SubscriptionsServicesService } from './services/subscriptions-services.service';
import { SubscriptionsServicesCoreService } from './services/subscriptions-services-core.service';
import { SubscriptionsServicesValidateService } from './services/subscriptions-services-validate.service';
import { SubscriptionsServicesCustomService } from './services/subscriptions-services-custom.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsService])],
  controllers: [SubscriptionsServicesController],
  providers: [
    SubscriptionsServicesService,
    SubscriptionsServicesCoreService,
    SubscriptionsServicesValidateService,
    SubscriptionsServicesCustomService,
  ],
  exports: [SubscriptionsServicesService, SubscriptionsServicesValidateService],
})
export class SubscriptionsServicesModule {}
