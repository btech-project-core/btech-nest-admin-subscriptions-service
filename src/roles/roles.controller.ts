import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './services/roles.service';
import { CreateRoleDto, CreateRoleResponseDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleResponseDto } from './dto/update-role.dto';
import {
  FindAllRoleDto,
  FindAllRoleResponseDto,
} from './dto/find-all-role.dto';
import {
  UpdateRoleStatusDto,
  UpdateRoleStatusResponseDto,
} from './dto/update-role-status.dto';
import { FindOneRoleResponseDto } from './dto/find-one-role.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern('role.create')
  async create(
    @Payload() createRoleDto: CreateRoleDto,
  ): Promise<CreateRoleResponseDto> {
    return await this.rolesService.create(createRoleDto);
  }

  @MessagePattern('role.findAll')
  async findAll(
    @Payload() findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    return await this.rolesService.findAll(findAllRoleDto);
  }

  @MessagePattern('role.findOne')
  async findOne(
    @Payload('roleId', ParseUUIDPipe) roleId: string,
  ): Promise<FindOneRoleResponseDto> {
    return await this.rolesService.findOne(roleId);
  }

  @MessagePattern('role.update')
  async update(
    @Payload() updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleResponseDto> {
    return await this.rolesService.update(updateRoleDto);
  }

  @MessagePattern('role.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateRoleStatusResponseDto> {
    return await this.rolesService.updateStatus(updateStatusDto);
  }
}
