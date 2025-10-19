import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities';
import {
  FindOneSubscriberByIdResponseDto,
  GetSubscribersByBusinessDto,
  GetSubscribersByBusinessResponseDto,
} from '../dto';
import {
  formatFindOneSubscriberIdResponse,
  formatSubscribersByBusinessResponse,
} from '../helpers';
import { StatusSubscription } from 'src/subscriptions/enums';
import { AdminPersonsService } from 'src/common/services';
import { envs, SERVICE_NAME } from 'src/config';
import { CodeService, CodeFeatures } from 'src/common/enums';
import {
  SubscriberInfoResponseDto,
  PaginationResponseDto,
} from 'src/common/dto';
import { formatSubscriberInfoResponse } from '../helpers';

@Injectable()
export class SubscribersCustomService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async findOneBySubscriberId(
    subscriberId: string,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      });
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario no se encuentra registrado`,
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'El usuario se encuentra sin suscripción activa',
      });
    return formatFindOneSubscriberIdResponse(subscriber);
  }

  async getSubscriberInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberInfoResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');

    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (service)
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });

    const subscriber = await queryBuilder.getOne();

    if (!subscriber)
      throw new RpcException({
        message: `El subscriber con id ${subscriberId} no se encuentra registrado`,
        service: SERVICE_NAME,
      });

    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonBySubscriberId(
        subscriber.naturalPersonId,
      );

    const subscriptionPersonData =
      await this.adminPersonsService.findOneSubscriptionPersonData(
        subscriber.subscriptionsBussine.personId,
      );

    return formatSubscriberInfoResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
    );
  }

  async querySubscriberByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<Subscriber | null> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.username = :username', { username })
      .andWhere('subscriptionsService.code = :service', { service })
      .andWhere(
        'subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId',
      )
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (service === CodeService.VDI && domain !== envs.domain.principal) {
      queryBuilder
        .leftJoinAndSelect(
          'subscriptionDetail.subscriptionDetailFeatures',
          'subscriptionDetailFeatures',
        )
        .leftJoinAndSelect(
          'subscriptionDetailFeatures.subscriptionFeatures',
          'subscriptionFeatures',
        );
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
            { subscriptionDetailId: domain },
          ).orWhere(
            'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
            {
              code: CodeFeatures.DOM,
              domain: domain,
            },
          );
        }),
      );
    }
    return await queryBuilder.getOne();
  }

  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const subscribersSince30Sep = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .select(['subscriber.username', 'subscriber.createdAt'])
      .where('subscriber.createdAt >= :startDate', {
        startDate: '2025-09-30 00:00:00',
      })
      .orderBy('subscriber.createdAt', 'ASC')
      .getMany();
    if (subscribersSince30Sep.length === 0)
      return {
        message: 'No se encontraron subscribers desde el 30 de septiembre',
      };
    const usernames = subscribersSince30Sep.map((sub) => sub.username);
    // Guardar el JSON
    const outputPath = path.join(
      process.cwd(),
      'src',
      'json-backups',
      'subscribers-since-sept-30.json',
    );
    await fs.writeFile(outputPath, JSON.stringify(usernames, null, 2));
    return {
      message: `Se encontraron ${subscribersSince30Sep.length} subscribers registrados desde el 30 de septiembre. Usernames guardados en: ${outputPath}`,
    };
  }

  async getSubscribersByBusiness(
    dto: GetSubscribersByBusinessDto,
  ): Promise<PaginationResponseDto<GetSubscribersByBusinessResponseDto>> {
    const { page = 1, limit = 10, ...filters } = dto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where(
        'subscriptionsBussine.subscriptionBussineId = :subscriptionBussineId',
        { subscriptionBussineId: filters.subscriptionBussineId },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (filters.service) {
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service: filters.service,
      });
    }

    queryBuilder.orderBy('subscriber.createdAt', 'DESC');

    const [subscribers, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (subscribers.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const naturalPersonIds = subscribers.map((sub) => sub.naturalPersonId);
    const naturalPersons =
      await this.adminPersonsService.findMultipleNaturalPersonsByIds({
        naturalPersonIds,
      });

    const naturalPersonsMap = new Map(
      naturalPersons.map((np) => [np.naturalPersonId, np]),
    );

    const data = subscribers
      .map((subscriber) => {
        const naturalPerson = naturalPersonsMap.get(subscriber.naturalPersonId);
        if (!naturalPerson) return null;
        return formatSubscribersByBusinessResponse(subscriber, naturalPerson);
      })
      .filter(
        (item): item is GetSubscribersByBusinessResponseDto => item !== null,
      );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
