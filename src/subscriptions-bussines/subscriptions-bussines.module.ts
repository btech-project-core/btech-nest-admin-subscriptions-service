import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionsBussinesController } from './subscriptions-bussines.controller';
import { SubscriptionsBussine } from './entities/subscriptions-bussine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsBussinesService } from './subscriptions-bussines.service';
import { SubscriptionsDetailModule } from 'src/subscriptions-detail/subscriptions-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsBussine]),
    forwardRef(() => SubscriptionsDetailModule),
  ],
  controllers: [SubscriptionsBussinesController],
  providers: [SubscriptionsBussinesService],
  exports: [SubscriptionsBussinesService],
})
export class SubscriptionsBussinesModule {}
