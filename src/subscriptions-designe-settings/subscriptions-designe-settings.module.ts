import { Module } from '@nestjs/common';
import { SubscriptionsDesigneSettingsService } from './subscriptions-designe-settings.service';
import { SubscriptionsDesigneSettingsController } from './subscriptions-designe-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsDesigneSetting } from './entities/subscriptions-designe-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsDesigneSetting])],
  controllers: [SubscriptionsDesigneSettingsController],
  providers: [SubscriptionsDesigneSettingsService],
})
export class SubscriptionsDesigneSettingsModule {}
