import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesCoreService } from './services/roles-core.service';
import { RolesValidateService } from './services/roles-validate.service';
import { RolesCustomService } from './services/roles-custom.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesCoreService,
    RolesValidateService,
    RolesCustomService,
  ],
  exports: [RolesService, RolesValidateService, RolesCustomService],
})
export class RolesModule {}
