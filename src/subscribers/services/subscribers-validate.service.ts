import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import {
  SubscriberAlertLevelValidation,
  SubscriberAlertLevelRaw,
} from '../interfaces/subscriber-alert-level.interface';
import {
  ValidateParentCompanyUserDto,
  ValidateParentCompanyUserResponseDto,
} from '../dto';

@Injectable()
export class SubscribersValidateService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async validateExists(subscriberId: string): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId: subscriberId.trim() },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Suscriptor con ID '${subscriberId}' no encontrado`,
      });
    return subscriber;
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

  async isValidByNaturalPersonId(
    naturalPersonIds: string[],
    service: string,
  ): Promise<string> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .innerJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetail',
      )
      .innerJoin(
        'subscribersSubscriptionDetail.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .where('subscriber.naturalPersonId IN (:...naturalPersonIds)', {
        naturalPersonIds,
      })
      .andWhere('subscriptionsService.code = :service', { service });

    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario ingresado no se encuentra registrado`,
      });
    return subscriber.username;
  }

  async validateSubscriberAlertLevel(
    subscriberIds: string[],
    levelAlertCode: string,
  ): Promise<SubscriberAlertLevelValidation[]> {
    const results: SubscriberAlertLevelRaw[] = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .leftJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetail',
      )
      .leftJoin(
        'subscribersSubscriptionDetail.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoin(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoin(
        'subscriptionDetail.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .leftJoin(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .select('subscriber.subscriberId', 'subscriberId')
      .addSelect('subscriptionDetailFeatures.value', 'value')
      .addSelect(
        'subscriptionDetail.subscriptionDetailId',
        'subscriptionDetailId',
      )
      .where('subscriber.subscriberId IN (:...subscriberIds)', {
        subscriberIds,
      })
      .andWhere('subscriptionFeatures.code = :levelAlertCode', {
        levelAlertCode,
      })
      .andWhere('subscriptionsService.code = :serviceCode', {
        serviceCode: 'VDI',
      })
      .getRawMany();

    return results.map((row) => ({
      subscriberId: row.subscriberId,
      hasAlertLevel: true,
      alertMinutesBefore: row.value ? parseInt(row.value, 10) : undefined,
      subscriptionDetailId: row.subscriptionDetailId,
    }));
  }

  async validateParentCompanyUser(
    validateParentCompanyUserDto: ValidateParentCompanyUserDto,
  ): Promise<ValidateParentCompanyUserResponseDto> {
    const { subscriptionBussineId } = validateParentCompanyUserDto;
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscription.subscriptionsBussine',
        'parentSubscriptionsBussine',
      )
      .where(
        'subscriptionsBussine.subscriptionBussineId = :subscriptionBussineId',
        { subscriptionBussineId },
      );
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'El usuario no se encuentra registrado en esta empresa',
      });
    const isParentCompanyUser =
      subscriber.subscriptionsBussine.personId ===
      subscriber.subscriptionsBussine.subscription.personId;

    // Obtener el subscriptionBussineId del padre
    const parentSubscriptionBussineId =
      subscriber.subscriptionsBussine.subscription.subscriptionsBussine.find(
        (sb) =>
          sb.personId === subscriber.subscriptionsBussine.subscription.personId,
      )?.subscriptionBussineId || null;

    return { isParentCompanyUser, parentSubscriptionBussineId };
  }
}
