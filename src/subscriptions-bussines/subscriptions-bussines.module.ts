import { Module } from '@nestjs/common';
import { SubscriptionsBussinesController } from './subscriptions-bussines.controller';
import { SubscriptionsBussine } from './entities/subscriptions-bussine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsBussinesService } from './subscriptions-bussines.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsBussine])],
  controllers: [SubscriptionsBussinesController],
  providers: [SubscriptionsBussinesService],
})
export class SubscriptionsBussinesModule {}
