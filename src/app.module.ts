import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionsDesigneSettingsModule } from './subscriptions-designe-settings/subscriptions-designe-settings.module';
import { SubscriptionsTypeModule } from './subscriptions-type/subscriptions-type.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { SubscriptionsBussinesModule } from './subscriptions-bussines/subscriptions-bussines.module';
import { MessagingModule } from './messaging/messaging.module';
import { SubscriptionsDetailModule } from './subscriptions-detail/subscriptions-detail.module';
import { SubscriptionsFeaturesModule } from './subscriptions-features/subscriptions-features.module';
import { SubscriptionsServicesModule } from './subscriptions-services/subscriptions-services.module';
import { DesigneModeModule } from './designe-mode/designe-mode.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MessagingModule.register(),
    RolesModule,
    SubscribersModule,
    SubscriptionsModule,
    SubscriptionsDesigneSettingsModule,
    SubscriptionsTypeModule,
    CommonModule,
    SubscriptionsBussinesModule,
    SubscriptionsDetailModule,
    SubscriptionsFeaturesModule,
    SubscriptionsServicesModule,
    DesigneModeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
