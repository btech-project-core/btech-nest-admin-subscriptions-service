import { Injectable } from '@nestjs/common';
import {
  CreateOrUpdateSubscriberDesignePreferenceDto,
  CreateOrUpdateSubscriberDesignePreferenceResponseDto,
} from '../dto/create-or-update-subscriber-designe-preference.dto';
import { ValidateSubscriberDesignResponseDto } from '../dto/validate-subscriber-design.dto';
import { SubscriberDesignePreferenceCoreService } from './subscriber-designe-preference-core.service';

@Injectable()
export class SubscriberDesignePreferenceService {
  constructor(
    private readonly subscriberDesignePreferenceCoreService: SubscriberDesignePreferenceCoreService,
  ) {}

  async createOrUpdate(
    createOrUpdateDto: CreateOrUpdateSubscriberDesignePreferenceDto,
  ): Promise<CreateOrUpdateSubscriberDesignePreferenceResponseDto> {
    return await this.subscriberDesignePreferenceCoreService.createOrUpdate(
      createOrUpdateDto,
    );
  }

  async validateDesign(
    subscriberId: string,
  ): Promise<ValidateSubscriberDesignResponseDto> {
    return await this.subscriberDesignePreferenceCoreService.validateDesign(
      subscriberId,
    );
  }
}
