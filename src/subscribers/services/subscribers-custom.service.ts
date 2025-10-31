import { HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities';
import {
  FindOneSubscriberByIdResponseDto,
  GetSubscribersByBusinessDto,
  GetSubscribersByBusinessResponseDto,
  CreateSubscriberResponseDto,
  CreateSubscriberDto,
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
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { SubscribersSubscriptionDetailCoreService } from 'src/subscribers-subscription-detail/services/subscribers-subscription-detail-core.service';
import { SubscriberRoleCoreService } from './subscriber-role-core.service';
import { RolesCustomService } from 'src/roles/services/roles-custom.service';
import { SubscriptionsBussinesCustomService } from 'src/subscriptions-bussines/services/subscriptions-bussines-custom.service';
import { SubscriptionsDetailCustomService } from 'src/subscriptions-detail/services/subscriptions-detail-custom.service';
import * as bcrypt from 'bcryptjs';
import { StorageRepository } from '../providers/storage/storage.repository';

@Injectable()
export class SubscribersCustomService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly subscriberRoleCoreService: SubscriberRoleCoreService,
    private readonly rolesCustomService: RolesCustomService,
    private readonly subscriptionsBussinesCustomService: SubscriptionsBussinesCustomService,
    @Inject(forwardRef(() => SubscriptionsDetailCustomService))
    private readonly subscriptionsDetailCustomService: SubscriptionsDetailCustomService,
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

    const subscriber = await queryBuilder.getOne();
    
    return subscriber || null;
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

  async registerSubscriberAlternal(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    const { username, password, naturalPersonId, domain, service } =
      createSubscriberDto;

    const subscriptionsBussine =
      await this.subscriptionsBussinesCustomService.findOneByDomainOrTenantId(
        domain,
      );

    const subscriptionDetail =
      await this.subscriptionsDetailCustomService.findOneByBussineIdAndService(
        subscriptionsBussine.subscriptionBussineId,
        service,
      );

    return this.createSubscriberAlternal(
      username,
      password,
      naturalPersonId,
      subscriptionsBussine,
      subscriptionDetail,
      createSubscriberDto.role || 'CLI',
    );
  }

  async createSubscriberAlternal(
    username: string,
    password: string,
    naturalPersonId: string,
    subscriptionsBussine: SubscriptionsBussine,
    subscriptionDetail: SubscriptionDetail,
    roleCode?: string,
  ): Promise<CreateSubscriberResponseDto> {
    const role = await this.rolesCustomService.findOneByCode(
      roleCode ? roleCode : 'CLI',
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const subscriber = this.subscriberRepository.create({
      username,
      password: hashedPassword,
      isConfirm: true,
      naturalPersonId,
      subscriptionsBussine,
    });
    const subscriberSaved = await this.subscriberRepository.save(subscriber);

    const subscribersSubscriptionDetail =
      await this.subscribersSubscriptionDetailCoreService.create(
        subscriberSaved,
        subscriptionDetail,
        true,
      );

    await this.subscriberRoleCoreService.create(
      subscribersSubscriptionDetail,
      role,
      true,
    );

    return {
      subscriberId: subscriberSaved.subscriberId,
      username: subscriberSaved.username,
    };
  }
}
