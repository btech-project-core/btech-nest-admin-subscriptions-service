import { HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import {
  CreateSubscriberDto,
  CreateSubscriberResponseDto,
} from '../dto/create-subscriber.dto';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { RolesCustomService } from 'src/roles/services/roles-custom.service';
import { SubscribersAuthService } from './subscribers-auth.service';
import { SubscriberRoleCoreService } from './subscriber-role-core.service';
import { SubscriptionsDetailCustomService } from '../../subscriptions-detail/services/subscriptions-detail-custom.service';
import { SubscribersSubscriptionDetailCoreService } from '../../subscribers-subscription-detail/services/subscribers-subscription-detail-core.service';
import { SubscriptionsBussinesCustomService } from 'src/subscriptions-bussines/services/subscriptions-bussines-custom.service';

@Injectable()
export class SubscribersCoreService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscriptionsBussinesCustomService: SubscriptionsBussinesCustomService,
    private readonly subscriberRoleCoreService: SubscriberRoleCoreService,
    @Inject(forwardRef(() => SubscriptionsDetailCustomService))
    private readonly subscriptionsDetailCustomService: SubscriptionsDetailCustomService,
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly rolesCustomService: RolesCustomService,
    private readonly subscribersAuthService: SubscribersAuthService,
  ) {}

  async create(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    const { username, password, naturalPersonId, domain, service } =
      createSubscriberDto;
    const subscriptionsBussine =
      await this.subscriptionsBussinesCustomService.findOneByDomainOrTenantId(
        domain,
      );
    // Encontrar y validar el subscriptionDetail específico por subscriptionBussineId y service
    const targetSubscriptionDetail =
      await this.subscriptionsDetailCustomService.findOneByBussineIdAndService(
        subscriptionsBussine.subscriptionBussineId,
        service,
      );
    const role = await this.rolesCustomService.findOneByCode('CLI');
    // Crear subscriber básico
    const subscriber = this.subscriberRepository.create({
      username,
      password,
      isConfirm: true,
      naturalPersonId,
      subscriptionsBussine,
    });
    const subscriberSaved = await this.subscriberRepository.save(subscriber);
    // Crear la relación intermedia con el servicio específico
    const subscribersSubscriptionDetail =
      await this.subscribersSubscriptionDetailCoreService.create(
        subscriberSaved,
        targetSubscriptionDetail,
        true,
      );
    // Crear la asignación del rol para este servicio específico
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

  async update(
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
      await this.subscribersAuthService.findOneBySubscriberIdWithLogin(
        subscriberId,
      );
    if (!updatedSubscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario con id ${subscriberId} no se encuentra registrado.`,
      });
    return updatedSubscriber;
  }

  async delete(subscriberId: string): Promise<{ message: string }> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El suscriptor con id ${subscriberId} no se encuentra registrado.`,
      });
    await this.subscriberRepository.remove(subscriber);
    return {
      message: 'Suscriptor eliminado correctamente',
    };
  }
}
