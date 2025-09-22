import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
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
import { formatRoleResponse } from './helpers/format-role-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<CreateRoleResponseDto> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async findAll(
    findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllRoleDto;
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (term)
      queryBuilder.andWhere(
        '(role.description LIKE :term OR role.code LIKE :term)',
        { term: `%${term}%` },
      );
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('role.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('role.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) => formatRoleResponse(data)),
      };
    }
    const roles = await queryBuilder.getMany();
    return roles.map(formatRoleResponse);
  }

  async findOne(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId.trim() },
    });
    if (!role)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Rol con ID '${roleId}' no encontrado`,
      });
    return role;
  }

  async findOneByCode(code: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { code: code.trim() },
    });
    if (!role)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Rol con código '${code}' no encontrado`,
      });
    return role;
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<UpdateRoleResponseDto> {
    const { roleId, code, description } = updateRoleDto;
    const role = await this.findOne(roleId);

    role.code = code ?? role.code;
    role.description = description ?? role.description;

    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async updateStatus(
    updateRoleStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateRoleStatusResponseDto> {
    const { roleId, isActive } = updateRoleStatusDto;
    const existingRole = await this.findOne(roleId);

    if (!isActive) await this.relatedSubscribers(roleId);

    await this.roleRepository.update(roleId, {
      isActive,
    });

    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Rol '${existingRole.description}' ${statusMessage} exitosamente`,
    };
  }

  private async relatedSubscribers(roleId: string): Promise<void> {
    const relatedSubscribersCount = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.subscriberRoles', 'subscriberRole')
      .innerJoin('subscriberRole.subscriber', 'subscriber')
      .where('role.roleId = :roleId', {
        roleId,
      })
      .andWhere('role.isActive = true')
      .getCount();

    if (relatedSubscribersCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el rol porque tiene suscriptores asociados',
      });
  }

  async isValidRole(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { roleId, isActive: true },
    });
    if (!role)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Rol con ID ${roleId} no encontrado o inactivo`,
      });
    return role;
  }
}
