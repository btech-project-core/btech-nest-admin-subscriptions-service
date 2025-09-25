import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionFeatures } from '../entities/subscription-features.entity';

@Injectable()
export class SubscriptionsFeaturesValidateService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
  ) {}

  async isValidSubscriptionFeatures(
    subscriptionFeaturesId: string,
  ): Promise<SubscriptionFeatures> {
    const subscriptionFeatures =
      await this.subscriptionFeaturesRepository.findOne({
        where: { subscriptionFeaturesId, isActive: true },
      });
    if (!subscriptionFeatures)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Característica de suscripción con ID ${subscriptionFeaturesId} no encontrada o inactiva`,
      });
    return subscriptionFeatures;
  }
}
