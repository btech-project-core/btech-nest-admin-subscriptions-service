import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from './dto/create-subscriptions-bussine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionsBussinesService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}
  async create(
    createSubscriptionsBussineDto: CreateSubscriptionsBussineDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(SubscriptionsBussine)
      : this.subscriptionsBussinesRepository;
    const subscriptionsBussines = repository.create(
      createSubscriptionsBussineDto,
    );
    await repository.save(subscriptionsBussines);
    return subscriptionsBussines;
  }

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
