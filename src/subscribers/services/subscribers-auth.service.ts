import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import { FindOneUsernameResponseDto } from '../dto/find-one-username.dto';
import { formatFindOneUsernameResponse } from '../helpers/format-find-one-username-response.helper';
import { formatSubscriberWithLoginResponse } from '../helpers/format-subscriber-with-login-response.helper';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { CodeService } from 'src/common/enums/code-service.enum';
import { CodeFeatures } from 'src/common/enums/code-features.enum';
import { envs } from 'src/config/envs.config';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';

@Injectable()
export class SubscribersAuthService {
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
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encuentra el usuario con el código de acceso: ${username}`,
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'El usuario se encuentra sin suscripción activa',
      });
    return formatFindOneUsernameResponse(subscriber);
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

    if (service) {
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });
      queryBuilder.andWhere(
        'subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId',
      );
    }

    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario no se encuentra registrado`,
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
}
