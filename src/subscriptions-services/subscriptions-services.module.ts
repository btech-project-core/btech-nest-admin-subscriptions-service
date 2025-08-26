import { Module } from '@nestjs/common';
import { SubscriptionsServicesService } from './subscriptions-services.service';
import { SubscriptionsServicesController } from './subscriptions-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './entities/subscriptions-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsService])],
  controllers: [SubscriptionsServicesController],
  providers: [SubscriptionsServicesService],
  exports: [SubscriptionsServicesService],
})
export class SubscriptionsServicesModule {}
