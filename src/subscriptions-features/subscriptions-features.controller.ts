import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsFeaturesService } from './subscriptions-features.service';
import {
  CreateSubscriptionFeaturesDto,
  CreateSubscriptionFeaturesResponseDto,
} from './dto/create-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesDto,
  UpdateSubscriptionFeaturesResponseDto,
} from './dto/update-subscription-features.dto';
import {
  FindAllSubscriptionFeaturesDto,
  FindAllSubscriptionFeaturesResponseDto,
} from './dto/find-all-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesStatusDto,
  UpdateSubscriptionFeaturesStatusResponseDto,
} from './dto/update-subscription-features-status.dto';
import { FindOneSubscriptionFeaturesResponseDto } from './dto/find-one-subscription-features.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Controller()
export class SubscriptionsFeaturesController {
  constructor(
    private readonly subscriptionsFeaturesService: SubscriptionsFeaturesService,
  ) {}

  @MessagePattern('subscriptionFeatures.create')
  async create(
    @Payload() createSubscriptionFeaturesDto: CreateSubscriptionFeaturesDto,
  ): Promise<CreateSubscriptionFeaturesResponseDto> {
    return await this.subscriptionsFeaturesService.create(
      createSubscriptionFeaturesDto,
    );
  }

  @MessagePattern('subscriptionFeatures.findAll')
  async findAll(
    @Payload() findAllSubscriptionFeaturesDto: FindAllSubscriptionFeaturesDto,
  ): Promise<
    | FindAllSubscriptionFeaturesResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionFeaturesResponseDto>
  > {
    return await this.subscriptionsFeaturesService.findAll(
      findAllSubscriptionFeaturesDto,
    );
  }

  @MessagePattern('subscriptionFeatures.findOne')
  async findOne(
    @Payload('subscriptionFeaturesId', ParseUUIDPipe)
    subscriptionFeaturesId: string,
  ): Promise<FindOneSubscriptionFeaturesResponseDto> {
    return await this.subscriptionsFeaturesService.findOne(
      subscriptionFeaturesId,
    );
  }

  @MessagePattern('subscriptionFeatures.update')
  async update(
    @Payload() updateSubscriptionFeaturesDto: UpdateSubscriptionFeaturesDto,
  ): Promise<UpdateSubscriptionFeaturesResponseDto> {
    return await this.subscriptionsFeaturesService.update(
      updateSubscriptionFeaturesDto,
    );
  }

  @MessagePattern('subscriptionFeatures.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateSubscriptionFeaturesStatusDto,
  ): Promise<UpdateSubscriptionFeaturesStatusResponseDto> {
    return await this.subscriptionsFeaturesService.updateStatus(
      updateStatusDto,
    );
  }
}
