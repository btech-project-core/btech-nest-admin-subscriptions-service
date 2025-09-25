import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, CreateRoleResponseDto } from '../dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleResponseDto } from '../dto/update-role.dto';
import {
  FindAllRoleDto,
  FindAllRoleResponseDto,
} from '../dto/find-all-role.dto';
import {
  UpdateRoleStatusDto,
  UpdateRoleStatusResponseDto,
} from '../dto/update-role-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { RolesCoreService } from './roles-core.service';

@Injectable()
export class RolesService {
  constructor(private readonly rolesCoreService: RolesCoreService) {}

  async create(createRoleDto: CreateRoleDto): Promise<CreateRoleResponseDto> {
    return await this.rolesCoreService.create(createRoleDto);
  }

  async findAll(
    findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    return await this.rolesCoreService.findAll(findAllRoleDto);
  }

  async findOne(roleId: string): Promise<Role> {
    return await this.rolesCoreService.findOne(roleId);
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<UpdateRoleResponseDto> {
    return await this.rolesCoreService.update(updateRoleDto);
  }

  async updateStatus(
    updateRoleStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateRoleStatusResponseDto> {
    return await this.rolesCoreService.updateStatus(updateRoleStatusDto);
  }
}
