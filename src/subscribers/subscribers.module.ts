import { Module } from '@nestjs/common';
import { SubscribersService } from './services/subscribers.service';
import { SubscribersCoreService } from './services/subscribers-core.service';
import { SubscribersAuthService } from './services/subscribers-auth.service';
import { SubscribersValidateService } from './services/subscribers-validate.service';
import { SubscribersCustomService } from './services/subscribers-custom.service';
import { SubscribersBulkService } from './services/subscribers-bulk.service';
import { SubscriberRoleCoreService } from './services/subscriber-role-core.service';
import { SubscribersController } from './subscribers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { SubscriberRole } from './entities/subscriber-role.entity';
import { CommonModule } from 'src/common/common.module';
import { SubscriptionsBussinesModule } from 'src/subscriptions-bussines/subscriptions-bussines.module';
import { RolesModule } from 'src/roles/roles.module';
import { SubscriptionsDetailModule } from 'src/subscriptions-detail/subscriptions-detail.module';
import { SubscribersSubscriptionDetailModule } from 'src/subscribers-subscription-detail/subscribers-subscription-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, SubscriberRole]),
    CommonModule,
    SubscriptionsBussinesModule,
    SubscriptionsDetailModule,
    SubscribersSubscriptionDetailModule,
    RolesModule,
  ],
  controllers: [SubscribersController],
  providers: [
    SubscribersService,
    SubscribersCoreService,
    SubscribersAuthService,
    SubscribersValidateService,
    SubscribersCustomService,
    SubscribersBulkService,
    SubscriberRoleCoreService,
  ],
  exports: [
    SubscribersService,
    SubscribersValidateService,
    SubscribersBulkService,
  ],
})
export class SubscribersModule {}
