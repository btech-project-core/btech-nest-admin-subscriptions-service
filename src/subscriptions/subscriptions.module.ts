import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
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
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
