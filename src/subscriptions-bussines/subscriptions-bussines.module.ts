import { Module } from '@nestjs/common';
import { SubscriptionsBussinesController } from './subscriptions-bussines.controller';
import { SubscriptionsBussine } from './entities/subscriptions-bussine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetail } from './entities/subscription-detail.entity';
import { SubscriptionsBussinesService } from './services/subscriptions-bussines.service';
import { SubscriptionsDetailsService } from './services/subscriptions-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsBussine, SubscriptionDetail]),
  ],
  controllers: [SubscriptionsBussinesController],
  providers: [SubscriptionsBussinesService, SubscriptionsDetailsService],
})
export class SubscriptionsBussinesModule {}
