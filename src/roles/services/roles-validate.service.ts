import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesValidateService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async isValidRole(roleId: string): Promise<Role> {
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
