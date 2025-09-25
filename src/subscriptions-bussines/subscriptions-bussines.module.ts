import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionsBussinesController } from './subscriptions-bussines.controller';
import { SubscriptionsBussine } from './entities/subscriptions-bussine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsBussinesService } from './services/subscriptions-bussines.service';
import { SubscriptionsBussinesCoreService } from './services/subscriptions-bussines-core.service';
import { SubscriptionsBussinesValidateService } from './services/subscriptions-bussines-validate.service';
import { SubscriptionsBussinesCustomService } from './services/subscriptions-bussines-custom.service';
import { SubscriptionsDetailModule } from 'src/subscriptions-detail/subscriptions-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsBussine]),
    forwardRef(() => SubscriptionsDetailModule),
  ],
  controllers: [SubscriptionsBussinesController],
  providers: [
    SubscriptionsBussinesService,
    SubscriptionsBussinesCoreService,
    SubscriptionsBussinesValidateService,
    SubscriptionsBussinesCustomService,
  ],
  exports: [
    SubscriptionsBussinesService,
    SubscriptionsBussinesValidateService,
    SubscriptionsBussinesCoreService,
    SubscriptionsBussinesCustomService,
  ],
})
export class SubscriptionsBussinesModule {}
