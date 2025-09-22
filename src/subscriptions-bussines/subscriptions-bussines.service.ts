import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from './dto/create-subscriptions-bussine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsDetailService } from 'src/subscriptions-detail/services/subscriptions-detail.service';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Injectable()
export class SubscriptionsBussinesService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
  ) {}
  async create(
    subscription: Subscription,
    createSubscriptionsBussineDto: CreateSubscriptionsBussineDto,
    subscriptionsServices: any[],
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

  async getClientPersonIds(): Promise<string[]> {
    const result = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .select('subscriptionBussine.personId')
      .getMany();
    return result.map((row) => row.personId);
  }

  async findOneByDomainOrTenantId(
    domain: string,
  ): Promise<SubscriptionsBussine> {
    const result = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .innerJoin('subscriptionBussine.subscriptionDetail', 'subscriptionDetail')
      .innerJoin(
        'subscriptionDetail.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId: domain },
      )
      .orWhere(
        'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
        { code: 'DOM', domain: domain },
      )
      .getOne();
    if (!result)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se aprobó el registro para el dominio o tenantId: ${domain}`,
      });
    return result;
  }
}
