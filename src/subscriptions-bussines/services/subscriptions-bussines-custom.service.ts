import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../entities/subscriptions-bussine.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsDetailService } from 'src/subscriptions-detail/services/subscriptions-detail.service';
import { SubscriptionsService as SubscriptionsServiceEntity } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { format } from 'util';
import { CreateSubscriptionsBussineAlternalDto } from '../dto';
import { SubscriptionsBussinesCoreService } from './subscriptions-bussines-core.service';

@Injectable()
export class SubscriptionsBussinesCustomService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionsServiceEntity)
    private readonly subscriptionsServiceRepository: Repository<SubscriptionsServiceEntity>,
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
    private readonly subscriptionsBussinesCoreService: SubscriptionsBussinesCoreService,
  ) {}

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

  async createAlternal(
    dto: CreateSubscriptionsBussineAlternalDto,
  ): Promise<SubscriptionsBussine> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        subscriptionId: dto.subscriptionId,
      },
    });

    const subscriptionService =
      await this.subscriptionsServiceRepository.findOne({
        where: {
          subscriptionsServiceId: dto.subscriptionServiceId,
        },
      });

    if (!subscription) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: format(
          'No se encontró la suscripción con id: %s',
          dto.subscriptionId,
        ),
      });
    }

    if (!subscriptionService) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: format(
          'No se encontró el servicio de suscripción con id: %s',
          dto.subscriptionServiceId,
        ),
      });
    }

    const subscriptionBussineDto = {
      personId: dto.personId,
      subscriptionDetails: [
        {
          subscriptionServiceId: dto.subscriptionServiceId, // SUP
          initialDate: subscription.initialDate.toISOString(),
          finalDate: subscription.finalDate.toISOString(),
        },
      ],
      naturalPersons: dto.naturalPersons,
    };

    return this.subscriptionsBussinesCoreService.create(
      subscription,
      subscriptionBussineDto,
      [subscriptionService],
    );
  }
}
