import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { formatSubscriberWithLoginResponse } from './helpers/format-subscriber-with-login-response.helper';
import { RpcException } from '@nestjs/microservices';
import { FindOneUsernameResponseDto } from './dto/find-one-username.dto';
import { formatFindOneUsernameResponse } from './helpers/format-find-one-username-response.helper';
import { FindOneSubscriberByIdResponseDto } from './dto/find-one-subscriber-by-id.dto';
import { formatFindOneSubscriberIdResponse } from './helpers/format-find-one-subscriber-id-response.helper';
import { SERVICE_NAME } from 'src/config/constants';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { envs } from 'src/config/envs.config';
import { CodeFeatures } from 'src/common/enums/code-features.enum';
import { CodeService } from 'src/common/enums/code-service.enum';
import { formatSubscriberCompleteInfoResponse } from './helpers/format-get-subscriber-complete-info.helper';
import { SubscriberCompleteInfoResponseDto } from 'src/common/dto/subscriber-complete-info.dto';
import {
  FindSubscribersWithNaturalPersonsDto,
  SubscriberWithNaturalPersonDto,
} from './dto/find-subscribers-with-natural-persons.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async findOneByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<FindOneUsernameResponseDto> {
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
        'subscriptionDetail.subscriptionsDesigneSetting',
        'subscriptionsDesigneSetting',
      )
      .leftJoinAndSelect('subscriber.subscriberRoles', 'subscriberRoles')
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.username = :username', { username })
      .andWhere('subscriptionsService.code = :service', { service });

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
    if (!subscriber)
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: JSON.stringify({
          status: HttpStatus.NOT_FOUND,
          message: `No se encuentra el usuario con el código de acceso: ${username}`,
        }),
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: JSON.stringify({
          status: HttpStatus.UNAUTHORIZED,
          message: 'El usuario se encuentra sin suscripción activa',
        }),
      });
    return formatFindOneUsernameResponse(subscriber);
  }

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
        code: GrpcStatus.NOT_FOUND,
        message: JSON.stringify({
          status: HttpStatus.NOT_FOUND,
          message: `El usuario no se encuentra registrado`,
        }),
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: JSON.stringify({
          status: HttpStatus.UNAUTHORIZED,
          message: 'El usuario se encuentra sin suscripción activa',
        }),
      });
    return formatFindOneSubscriberIdResponse(subscriber);
  }

  async findOneBySubscriberIdWithLogin(
    subscriberId: string,
    service?: CodeService,
  ): Promise<UserProfileResponseDto | null> {
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
        'subscriptionDetail.subscriptionsDesigneSetting',
        'subscriptionsDesigneSetting',
      )
      .leftJoinAndSelect(
        'subscriptionsDesigneSetting.designerMode',
        'designerMode',
      )
      .leftJoinAndSelect('subscriber.subscriberRoles', 'subscriberRoles')
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId });

    if (service)
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: JSON.stringify({
          status: HttpStatus.NOT_FOUND,
          message: `El usuario no se encuentra registrado`,
        }),
      });

    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonBySubscriberId(
        subscriber.naturalPersonId,
      );
    const subscriptionPersonData =
      await this.adminPersonsService.findOneSubscriptionPersonData(
        subscriber.subscriptionsBussine.personId,
      );

    return formatSubscriberWithLoginResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
    );
  }

  async updateSubscriber(
    subscriberId: string,
    updateData: Partial<Subscriber>,
  ): Promise<UserProfileResponseDto> {
    const updateResult = await this.subscriberRepository.update(
      subscriberId,
      updateData,
    );
    if (updateResult.affected === 0)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario con id ${subscriberId} no se encuentra registrado.`,
      });
    const updatedSubscriber =
      await this.findOneBySubscriberIdWithLogin(subscriberId);
    if (!updatedSubscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario con id ${subscriberId} no se encuentra registrado.`,
      });
    return updatedSubscriber;
  }

  async getSubscriberCompleteInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberCompleteInfoResponseDto> {
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
      .leftJoinAndSelect('subscriber.subscriberRoles', 'subscriberRoles')
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId });

    if (service)
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });

    const subscriber = await queryBuilder.getOne();

    if (!subscriber)
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        details: JSON.stringify({
          status: HttpStatus.NOT_FOUND,
          message: `El subscriber con id ${subscriberId} no se encuentra registrado`,
          service: SERVICE_NAME,
        }),
      });

    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonBySubscriberId(
        subscriber.naturalPersonId,
      );

    const subscriptionPersonData =
      await this.adminPersonsService.findOneSubscriptionPersonData(
        subscriber.subscriptionsBussine.personId,
      );

    return formatSubscriberCompleteInfoResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
    );
  }

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

  async findSubscribersWithNaturalPersons(
    findDto: FindSubscribersWithNaturalPersonsDto,
  ): Promise<PaginationResponseDto<SubscriberWithNaturalPersonDto>> {
    const { subscriptionDetailId, ...paginationDto } = findDto;
    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .innerJoin('subscriber.subscriptionsBussine', 'subscriptionsBussine')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .innerJoin(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId,
        },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .select([
        'subscriber.subscriberId',
        'subscriber.username',
        'subscriber.naturalPersonId',
        'subscriber.createdAt',
      ])
      .orderBy('subscriber.createdAt', 'DESC');
    const paginatedResult = await paginateQueryBuilder(
      queryBuilder,
      paginationDto,
    );
    if (paginatedResult.data.length === 0)
      return {
        ...paginatedResult,
        data: [],
      };

    const naturalPersonsData =
      await this.adminPersonsService.findMultipleNaturalPersonsByIds({
        naturalPersonIds: paginatedResult.data.map((s) => s.naturalPersonId),
      });

    const naturalPersonsMap = new Map(
      naturalPersonsData.map((np) => [np.naturalPersonId, np]),
    );

    const subscribersWithNaturalPersons = paginatedResult.data.map(
      (subscriber) => ({
        subscriberId: subscriber.subscriberId,
        username: subscriber.username,
        naturalPerson: naturalPersonsMap.get(subscriber.naturalPersonId)!,
      }),
    );

    return {
      ...paginatedResult,
      data: subscribersWithNaturalPersons,
    };
  }
}
