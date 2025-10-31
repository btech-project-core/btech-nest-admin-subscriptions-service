import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import { FindOneUsernameResponseDto } from '../dto/find-one-username.dto';
import { formatFindOneUsernameResponse } from '../helpers/format-find-one-username-response.helper';
import { formatSubscriberWithLoginResponse } from '../helpers/format-subscriber-with-login-response.helper';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { CodeService } from 'src/common/enums/code-service.enum';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { SubscriptionsDetailFeaturesService } from 'src/subscriptions-detail/services/subscriptions-detail-features.service';
import { SubscribersCustomService } from './subscribers-custom.service';
import { SubscribersValidateService } from './subscribers-validate.service';

@Injectable()
export class SubscribersAuthService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscriptionsDetailFeaturesService: SubscriptionsDetailFeaturesService,
    private readonly subscribersCustomService: SubscribersCustomService,
    private readonly subscribersValidateService: SubscribersValidateService,
  ) {}

  async findOneByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<FindOneUsernameResponseDto> {
    let subscriber =
      await this.subscribersCustomService.querySubscriberByUsername(
        username,
        domain,
        service,
      );
    if (!subscriber) {
      const isValidWithDocumentNumber =
        await this.adminPersonsService.isValidDocumentNumberForUser(username);
      const newUsername =
        await this.subscribersValidateService.isValidByNaturalPersonId(
          isValidWithDocumentNumber.naturalPersonId,
        );
      console.log(`newUsername: ${newUsername}`);
      subscriber =
        await this.subscribersCustomService.querySubscriberByUsername(
          newUsername,
          domain,
          service,
        );
    }
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario con el código de acceso: ${username} no existe`,
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

  async setPassword(
    subscriberId: string,
    hashedPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El subscriber con ID ${subscriberId} no existe`,
      });
    subscriber.password = hashedPassword;
    await this.subscriberRepository.save(subscriber);
    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
    };
  }
}
