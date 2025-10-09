import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
import { SubscriberDesignePreference } from '../entities/subscriber-designe-preference.entity';

@Injectable()
export class SubscriberDesignePreferenceValidateService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
    @InjectRepository(SubscriberDesignePreference)
    private readonly subscriberDesignePreferenceRepository: Repository<SubscriberDesignePreference>,
  ) {}

  async validateSubscriptionDetailDesigneModeExists(
    subscriptionDetailDesigneModeId: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    const subscriptionDetailDesigneMode =
      await this.subscriptionDetailDesigneModeRepository.findOne({
        where: {
          subscriptionDetailDesigneModeId:
            subscriptionDetailDesigneModeId.trim(),
          isActive: true,
        },
        relations: ['designerMode'],
      });
    if (!subscriptionDetailDesigneMode)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Modo de diseño con ID '${subscriptionDetailDesigneModeId}' no encontrado o inactivo`,
      });
    return subscriptionDetailDesigneMode;
  }

  async validateDetails(
    subscriberId: string,
  ): Promise<SubscriberDesignePreference | null> {
    const subscriberDesignePreference =
      await this.subscriberDesignePreferenceRepository.findOne({
        where: {
          subscriber: { subscriberId },
        },
        relations: [
          'subscriber',
          'subscriptionDetailDesigneMode',
          'subscriptionDetailDesigneMode.designerMode',
        ],
      });
    return subscriberDesignePreference;
  }
}
