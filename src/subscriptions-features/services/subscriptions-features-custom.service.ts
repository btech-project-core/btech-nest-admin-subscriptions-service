import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionFeatures } from '../entities/subscription-features.entity';

@Injectable()
export class SubscriptionsFeaturesCustomService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
  ) {}

  async relatedSubscriptionDetails(
    subscriptionFeaturesId: string,
  ): Promise<void> {
    const relatedDetailsCount = await this.subscriptionFeaturesRepository
      .createQueryBuilder('subscriptionFeatures')
      .innerJoin(
        'subscriptionFeatures.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionDetail',
        'subscriptionDetail',
      )
      .where(
        'subscriptionFeatures.subscriptionFeaturesId = :subscriptionFeaturesId',
        {
          subscriptionFeaturesId,
        },
      )
      .andWhere('subscriptionDetail.isActive = true')
      .andWhere('subscriptionFeatures.isActive = true')
      .getCount();

    if (relatedDetailsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar la característica porque tiene detalles de suscripción asociados',
      });
  }
}
