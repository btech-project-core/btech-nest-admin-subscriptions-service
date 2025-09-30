import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';

@Injectable()
export class SubscribersValidateService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async checkActiveSubscriptionsByNaturalPersonId(
    naturalPersonId: string,
  ): Promise<boolean> {
    const activeSubscriptionsCount = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .innerJoin('subscriber.subscriptionsBussine', 'subscriptionsBussine')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .where('subscriber.naturalPersonId = :naturalPersonId', {
        naturalPersonId,
      })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .getCount();

    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede proceder porque el usuario tiene ${activeSubscriptionsCount} suscripción(es) activa(s)`,
      });
    return true;
  }

  async isValidByNaturalPersonId(naturalPersonId: string): Promise<string> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { naturalPersonId },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encuentra el usuario con el código de acceso: ${naturalPersonId}`,
      });
    return subscriber.username;
  }
}
