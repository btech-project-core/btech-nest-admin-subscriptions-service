import { Module } from '@nestjs/common';
import { SubscriptionsDesigneSettingsController } from './subscriptions-designe-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsDesigneSetting } from './entities/subscriptions-designe-setting.entity';
import { SubscriptionsDesigneSettingsService } from './services/subscriptions-designe-settings.service';
import { SubscriptionsDesigneSettingsCustomService } from './services/subscriptions-designe-settings-custom.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsDesigneSetting])],
  controllers: [SubscriptionsDesigneSettingsController],
  providers: [
    SubscriptionsDesigneSettingsService,
    SubscriptionsDesigneSettingsCustomService,
  ],
})
export class SubscriptionsDesigneSettingsModule {}
