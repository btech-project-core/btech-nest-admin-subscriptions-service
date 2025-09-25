import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from '../dto/create-subscriptions-bussine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscriptionsBussine } from '../entities/subscriptions-bussine.entity';
import { SubscriptionsDetailService } from 'src/subscriptions-detail/services/subscriptions-detail.service';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionsBussinesCoreService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
  ) {}

  async create(
    subscription: Subscription,
    createSubscriptionsBussineDto: CreateSubscriptionsBussineDto,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(SubscriptionsBussine)
      : this.subscriptionsBussinesRepository;

    const subscriptionsBussine = repository.create({
      personId: createSubscriptionsBussineDto.personId,
      subscription: subscription,
      numberAccounts: createSubscriptionsBussineDto.subscriptionDetails.length,
    });

    const savedSubscriptionsBussine =
      await repository.save(subscriptionsBussine);

    await this.subscriptionsDetailService.create(
      savedSubscriptionsBussine,
      createSubscriptionsBussineDto.subscriptionDetails,
      subscriptionsServices,
      queryRunner,
    );

    return savedSubscriptionsBussine;
  }

  async findOne(subscriptionBussineId: string): Promise<SubscriptionsBussine> {
    const subscriptionsBussine =
      await this.subscriptionsBussinesRepository.findOne({
        where: { subscriptionBussineId: subscriptionBussineId.trim() },
      });
    if (!subscriptionsBussine)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró la suscripción bussines con id: ${subscriptionBussineId}`,
      });
    return subscriptionsBussine;
  }
}
