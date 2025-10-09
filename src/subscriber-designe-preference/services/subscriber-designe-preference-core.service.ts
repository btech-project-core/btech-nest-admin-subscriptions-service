import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberDesignePreference } from '../entities/subscriber-designe-preference.entity';
import {
  CreateOrUpdateSubscriberDesignePreferenceDto,
  CreateOrUpdateSubscriberDesignePreferenceResponseDto,
} from '../dto/create-or-update-subscriber-designe-preference.dto';
import { ValidateSubscriberDesignResponseDto } from '../dto/validate-subscriber-design.dto';
import { SubscriberDesignePreferenceValidateService } from './subscriber-designe-preference-validate.service';
import { formatSubscriberDesignePreferenceResponse } from '../helpers/format-subscriber-designe-preference-response.helper';
import { SubscribersValidateService } from '../../subscribers/services/subscribers-validate.service';

@Injectable()
export class SubscriberDesignePreferenceCoreService {
  constructor(
    @InjectRepository(SubscriberDesignePreference)
    private readonly subscriberDesignePreferenceRepository: Repository<SubscriberDesignePreference>,
    private readonly subscriberDesignePreferenceValidateService: SubscriberDesignePreferenceValidateService,
    private readonly subscribersValidateService: SubscribersValidateService,
  ) {}

  async createOrUpdate(
    createOrUpdateDto: CreateOrUpdateSubscriberDesignePreferenceDto,
  ): Promise<CreateOrUpdateSubscriberDesignePreferenceResponseDto> {
    const { subscriberId, subscriptionDetailDesigneModeId } = createOrUpdateDto;
    // Validate subscriber exists
    await this.subscribersValidateService.validateExists(subscriberId);
    // Validate subscription detail designe mode exists
    const subscriptionDetailDesigneMode =
      await this.subscriberDesignePreferenceValidateService.validateSubscriptionDetailDesigneModeExists(
        subscriptionDetailDesigneModeId,
      );
    // Check if subscriber already has a preference
    let subscriberDesignePreference =
      await this.subscriberDesignePreferenceValidateService.validateDetails(
        subscriberId,
      );
    if (subscriberDesignePreference) {
      // Update existing preference
      subscriberDesignePreference.subscriptionDetailDesigneMode =
        subscriptionDetailDesigneMode;
      await this.subscriberDesignePreferenceRepository.save(
        subscriberDesignePreference,
      );
    } else {
      // Create new preference
      subscriberDesignePreference =
        this.subscriberDesignePreferenceRepository.create({
          subscriber: { subscriberId },
          subscriptionDetailDesigneMode: { subscriptionDetailDesigneModeId },
        });
      await this.subscriberDesignePreferenceRepository.save(
        subscriberDesignePreference,
      );
      // Reload with relations
      subscriberDesignePreference =
        await this.subscriberDesignePreferenceValidateService.validateDetails(
          subscriberId,
        );
    }
    return formatSubscriberDesignePreferenceResponse(
      subscriberDesignePreference!,
    );
  }

  async validateDesign(
    subscriberId: string,
  ): Promise<ValidateSubscriberDesignResponseDto> {
    // Validate subscriber exists
    await this.subscribersValidateService.validateExists(subscriberId);
    // Check if subscriber has a custom design preference
    const subscriberDesignePreference =
      await this.subscriberDesignePreferenceRepository.findOne({
        where: { subscriber: { subscriberId } },
        relations: [
          'subscriptionDetailDesigneMode',
          'subscriptionDetailDesigneMode.designerMode',
        ],
      });
    if (
      subscriberDesignePreference &&
      subscriberDesignePreference.subscriptionDetailDesigneMode
    )
      return {
        hasCustomDesign: true,
        designCode:
          subscriberDesignePreference.subscriptionDetailDesigneMode.designerMode
            .code,
      };
    return {
      hasCustomDesign: false,
    };
  }
}
