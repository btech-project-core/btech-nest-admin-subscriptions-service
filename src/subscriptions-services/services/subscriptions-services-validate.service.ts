import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../entities/subscriptions-service.entity';
import { Repository, In } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionsServicesValidateService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async isValidSubscriptionService(
    subscriptionsServiceId: string,
  ): Promise<SubscriptionsService> {
    const subscriptionsService =
      await this.subscriptionsServicesRepository.findOne({
        where: {
          subscriptionsServiceId: subscriptionsServiceId.trim(),
          isActive: true,
        },
      });
    if (!subscriptionsService)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Servicio de suscripción con ID '${subscriptionsServiceId}' no encontrado o inactivo`,
      });
    return subscriptionsService;
  }

  async validateSubscriptionServicesExist(
    subscriptionServiceIds: string[],
  ): Promise<SubscriptionsService[]> {
    const uniqueServiceIds = [...new Set(subscriptionServiceIds)];
    const existingServices = await this.subscriptionsServicesRepository.find({
      where: {
        subscriptionsServiceId: In(uniqueServiceIds),
        isActive: true,
      },
    });

    const existingIds = new Set(
      existingServices.map((s) => s.subscriptionsServiceId),
    );
    const missingIds = uniqueServiceIds.filter((id) => !existingIds.has(id));

    if (missingIds.length > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Servicios de suscripción no encontrados o inactivos: ${missingIds.join(', ')}`,
      });

    return existingServices;
  }
}
