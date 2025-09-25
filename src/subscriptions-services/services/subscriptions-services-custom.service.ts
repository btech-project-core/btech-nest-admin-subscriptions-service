import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../entities/subscriptions-service.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';

@Injectable()
export class SubscriptionsServicesCustomService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async relatedSubscriptionServices(
    subscriptionsServiceId: string,
  ): Promise<void> {
    const activeSubscriptionsCount = await this.subscriptionsServicesRepository
      .createQueryBuilder('subscriptionsService')
      .innerJoin(
        'subscriptionsService.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .where(
        'subscriptionsService.subscriptionsServiceId = :subscriptionsServiceId',
        {
          subscriptionsServiceId,
        },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .getCount();
    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el servicio porque tiene suscripciones activas asociadas',
      });
  }
}
