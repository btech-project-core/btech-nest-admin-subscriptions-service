import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsType } from '../entities/subscriptions-type.entity';

@Injectable()
export class SubscriptionsTypeValidateService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
  ) {}

  async isValidSubscriptionsType(subscriptionTypeId: string) {
    const subscriptionsType = await this.subscriptionsTypeRepository.findOne({
      where: { subscriptionTypeId, isActive: true },
    });
    if (!subscriptionsType)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Tipo de suscripción con ID ${subscriptionTypeId} no encontrado o inactivo`,
      });
    return subscriptionsType;
  }
}
