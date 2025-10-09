import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetailDesigneMode } from './entities/subscription-detail-designe-mode.entity';
import { SubscriptionDetailDesigneModeController } from './subscription-detail-designe-mode.controller';
import { SubscriptionDetailDesigneModeService } from './services/subscription-detail-designe-mode.service';
import { SubscriptionDetailDesigneModeCoreService } from './services/subscription-detail-designe-mode-core.service';
import { SubscriptionDetailDesigneModeValidateService } from './services/subscription-detail-designe-mode-validate.service';
import { SubscriptionDetailDesigneModeCustomService } from './services/subscription-detail-designe-mode-custom.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionDetailDesigneMode])],
  controllers: [SubscriptionDetailDesigneModeController],
  providers: [
    SubscriptionDetailDesigneModeService,
    SubscriptionDetailDesigneModeCoreService,
    SubscriptionDetailDesigneModeValidateService,
    SubscriptionDetailDesigneModeCustomService,
  ],
  exports: [
    SubscriptionDetailDesigneModeService,
    SubscriptionDetailDesigneModeCoreService,
    SubscriptionDetailDesigneModeValidateService,
    SubscriptionDetailDesigneModeCustomService,
  ],
})
export class SubscriptionDetailDesigneModeModule {}
