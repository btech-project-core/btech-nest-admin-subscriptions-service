import { Module } from '@nestjs/common';
import { DesigneModeService } from './designe-mode.service';
import { DesigneModeController } from './designe-mode.controller';

@Module({
  controllers: [DesigneModeController],
  providers: [DesigneModeService],
})
export class DesigneModeModule {}
