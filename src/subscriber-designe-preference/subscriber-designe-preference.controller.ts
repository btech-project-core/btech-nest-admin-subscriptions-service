import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SubscriberDesignePreferenceService } from './services/subscriber-designe-preference.service';
import {
  CreateOrUpdateSubscriberDesignePreferenceDto,
  CreateOrUpdateSubscriberDesignePreferenceResponseDto,
} from './dto/create-or-update-subscriber-designe-preference.dto';
import {
  ValidateSubscriberDesignDto,
  ValidateSubscriberDesignResponseDto,
} from './dto/validate-subscriber-design.dto';

@Controller()
export class SubscriberDesignePreferenceController {
  constructor(
    private readonly subscriberDesignePreferenceService: SubscriberDesignePreferenceService,
  ) {}

  @GrpcMethod('SubscriberDesignePreferenceService', 'CreateOrUpdate')
  async createOrUpdate(
    data: CreateOrUpdateSubscriberDesignePreferenceDto,
  ): Promise<CreateOrUpdateSubscriberDesignePreferenceResponseDto> {
    return await this.subscriberDesignePreferenceService.createOrUpdate(data);
  }

  @GrpcMethod('SubscriberDesignePreferenceService', 'ValidateDesign')
  async validateDesign(
    data: ValidateSubscriberDesignDto,
  ): Promise<ValidateSubscriberDesignResponseDto> {
    return await this.subscriberDesignePreferenceService.validateDesign(
      data.subscriberId,
    );
  }
}
