import { Module } from '@nestjs/common';
import { DesigneModeService } from './designe-mode.service';
import { DesigneModeController } from './designe-mode.controller';
import { DesignerMode } from './entities/designe-mode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DesignerMode])],
  controllers: [DesigneModeController],
  providers: [DesigneModeService],
})
export class DesigneModeModule {}
