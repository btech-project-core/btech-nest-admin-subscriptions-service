import { Module } from '@nestjs/common';
import { SubscriptionsFeaturesService } from './subscriptions-features.service';
import { SubscriptionsFeaturesController } from './subscriptions-features.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionFeatures } from './entities/subscription-features.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionFeatures])],
  controllers: [SubscriptionsFeaturesController],
  providers: [SubscriptionsFeaturesService],
})
export class SubscriptionsFeaturesModule {}
