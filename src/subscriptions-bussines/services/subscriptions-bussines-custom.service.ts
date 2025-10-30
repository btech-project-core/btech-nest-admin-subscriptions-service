import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../entities/subscriptions-bussine.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsDetailService } from 'src/subscriptions-detail/services/subscriptions-detail.service';
import { SubscriptionsService as SubscriptionsServiceEntity } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { format } from 'util';
import {
  CreateSubscriptionsBussineAlternalDto,
  GetClientBusinessesResponseDto,
  ClientBusinessDto,
  GetClientBusinessesDto,
} from '../dto';
import { SubscriptionsBussinesCoreService } from './subscriptions-bussines-core.service';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';

@Injectable()
export class SubscriptionsBussinesCustomService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionsServiceEntity)
    private readonly subscriptionsServiceRepository: Repository<SubscriptionsServiceEntity>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
    private readonly subscriptionsBussinesCoreService: SubscriptionsBussinesCoreService,
    private readonly adminPersonsService: AdminPersonsService,
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

  async findSubscriptionBussineIdBySubscriptionDetailId(
    subscriptionDetailId: string,
  ): Promise<string> {
    const result = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .innerJoin('subscriptionBussine.subscriptionDetail', 'subscriptionDetail')
      .select('subscriptionBussine.subscriptionBussineId')
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId: subscriptionDetailId.trim(),
        },
      )
      .getOne();
    if (!result)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró el negocio de suscripción para el detalle de suscripción: ${subscriptionDetailId}`,
      });
    return result.subscriptionBussineId;
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
    if (!subscription)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: format(
          'No se encontró la suscripción con id: %s',
          dto.subscriptionId,
        ),
      });
    if (!subscriptionService)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: format(
          'No se encontró el servicio de suscripción con id: %s',
          dto.subscriptionServiceId,
        ),
      });
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

  async getClientBusinesses(
    getClientBusinessDto: GetClientBusinessesDto,
  ): Promise<GetClientBusinessesResponseDto> {
    const parentBusiness = await this.subscriptionsBussinesRepository.findOne({
      where: {
        subscriptionBussineId: getClientBusinessDto.subscriptionBussineId,
      },
      relations: ['subscription'],
    });

    if (!parentBusiness)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: format(
          'No se encontró la empresa con id: %s',
          getClientBusinessDto.subscriptionBussineId,
        ),
      });

    const subscriptionsBussines = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .leftJoinAndSelect('subscriptionBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .where('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere('subscriptionsService.code = :service', { service: 'SUP' })

      .andWhere('subscription.personId = :parentPersonId', {
        parentPersonId: parentBusiness.personId,
      })
      .andWhere('subscriptionBussine.personId != :parentPersonId', {
        parentPersonId: parentBusiness.personId,
      })
      .getMany();

    const clientBusinesses: ClientBusinessDto[] = [];

    for (const subscriptionBussine of subscriptionsBussines) {
      // Obtener la información completa de la persona jurídica de la empresa cliente
      const juridicalPersonData =
        await this.adminPersonsService.findOneJuridicalPersonByPersonId({
          personId: subscriptionBussine.personId,
        });

      // Contar los subscribers activos de esta empresa cliente
      const subscribersCount = await this.subscriberRepository
        .createQueryBuilder('subscriber')
        .innerJoin('subscriber.subscriptionsBussine', 'subscriptionsBussine')
        .innerJoin(
          'subscriptionsBussine.subscriptionDetail',
          'subscriptionDetail',
        )
        .innerJoin(
          'subscriptionDetail.subscriptionsService',
          'subscriptionsService',
        )
        .innerJoin(
          'subscriber.subscribersSubscriptionDetails',
          'subscribersSubscriptionDetails',
        )
        .where(
          'subscriptionsBussine.subscriptionBussineId = :subscriptionBussineId',
          {
            subscriptionBussineId: subscriptionBussine.subscriptionBussineId,
          },
        )
        .andWhere('subscriptionsService.code = :service', { service: 'SUP' })
        .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
          isActive: true,
        })
        .getCount();

      clientBusinesses.push({
        subscriptionBussineId: subscriptionBussine.subscriptionBussineId,
        personId: subscriptionBussine.personId,
        businessName:
          juridicalPersonData.comercialName || juridicalPersonData.legalName,
        juridicalPerson: juridicalPersonData,
        subscribersCount,
        createdAt: subscriptionBussine.createdAt.toISOString(),
        updatedAt: subscriptionBussine.updatedAt.toISOString(),
      });
    }

    return { clientBusinesses };
  }
}
