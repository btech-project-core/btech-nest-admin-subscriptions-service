import { Module, forwardRef } from '@nestjs/common';
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
import { StorageModule } from './providers/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, SubscriberRole]),
    CommonModule,
    SubscriptionsBussinesModule,
    forwardRef(() => SubscriptionsDetailModule),
    SubscribersSubscriptionDetailModule,
    RolesModule,
    SubscriptionsDetailModule,
    StorageModule
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
    SubscribersCoreService,
    SubscribersCustomService,
  ],
})
export class SubscribersModule {}
