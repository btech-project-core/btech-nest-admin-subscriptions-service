import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../entities/subscriptions-bussine.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';

@Injectable()
export class SubscriptionsBussinesValidateService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}

  async checkActiveSubscriptionsByJuridicalPersonId(
    juridicalPersonId: string,
  ): Promise<boolean> {
    const activeSubscriptionsCount = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .innerJoin('subscriptionBussine.subscription', 'subscription')
      .innerJoin('subscription.person', 'person')
      .innerJoin('person.juridicalPerson', 'juridicalPerson')
      .where('juridicalPerson.juridicalPersonId = :juridicalPersonId', {
        juridicalPersonId,
      })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .getCount();

    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede proceder porque la empresa tiene ${activeSubscriptionsCount} suscripción(es) activa(s)`,
      });
    return true;
  }
}
