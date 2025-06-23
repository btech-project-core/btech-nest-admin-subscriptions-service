import { Module } from '@nestjs/common';
import { SubscriptionsBussinesService } from './subscriptions-bussines.service';
import { SubscriptionsBussinesController } from './subscriptions-bussines.controller';
import { SubscriptionsBussine } from './entities/subscriptions-bussine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetail } from './entities/subscription-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsBussine, SubscriptionDetail]),
  ],
  controllers: [SubscriptionsBussinesController],
  providers: [SubscriptionsBussinesService],
})
export class SubscriptionsBussinesModule {}
