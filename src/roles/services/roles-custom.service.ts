import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesCustomService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

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

  async relatedSubscribers(roleId: string): Promise<void> {
    const relatedSubscribersCount = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.subscriberRoles', 'subscriberRole')
      .innerJoin('subscriberRole.subscribersSubscriptionDetail', 'subscribersSubscriptionDetail')
      .innerJoin('subscribersSubscriptionDetail.subscriber', 'subscriber')
      .where('role.roleId = :roleId', {
        roleId,
      })
      .andWhere('role.isActive = true')
      .andWhere('subscriberRole.isActive = true')
      .andWhere('subscribersSubscriptionDetail.isActive = true')
      .getCount();

    if (relatedSubscribersCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el rol porque tiene suscriptores asociados',
      });
  }
}
