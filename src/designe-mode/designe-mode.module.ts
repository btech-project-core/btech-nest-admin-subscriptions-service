import { Module } from '@nestjs/common';
import { DesigneModeService } from './services/designe-mode.service';
import { DesigneModeCoreService } from './services/designe-mode-core.service';
import { DesigneModeValidateService } from './services/designe-mode-validate.service';
import { DesigneModeCustomService } from './services/designe-mode-custom.service';
import { DesigneModeController } from './designe-mode.controller';
import { DesignerMode } from './entities/designe-mode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DesignerMode])],
  controllers: [DesigneModeController],
  providers: [
    DesigneModeService,
    DesigneModeCoreService,
    DesigneModeValidateService,
    DesigneModeCustomService,
  ],
  exports: [DesigneModeService, DesigneModeValidateService],
})
export class DesigneModeModule {}
