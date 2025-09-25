import { Injectable } from '@nestjs/common';
import { SubscriptionFeatures } from '../entities/subscription-features.entity';
import {
  CreateSubscriptionFeaturesDto,
  CreateSubscriptionFeaturesResponseDto,
} from '../dto/create-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesDto,
  UpdateSubscriptionFeaturesResponseDto,
} from '../dto/update-subscription-features.dto';
import {
  FindAllSubscriptionFeaturesDto,
  FindAllSubscriptionFeaturesResponseDto,
} from '../dto/find-all-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesStatusDto,
  UpdateSubscriptionFeaturesStatusResponseDto,
} from '../dto/update-subscription-features-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsFeaturesCoreService } from './subscriptions-features-core.service';

@Injectable()
export class SubscriptionsFeaturesService {
  constructor(
    private readonly subscriptionsFeaturesCoreService: SubscriptionsFeaturesCoreService,
  ) {}

  async create(
    createSubscriptionFeaturesDto: CreateSubscriptionFeaturesDto,
  ): Promise<CreateSubscriptionFeaturesResponseDto> {
    return this.subscriptionsFeaturesCoreService.create(
      createSubscriptionFeaturesDto,
    );
  }

  async findAll(
    findAllSubscriptionFeaturesDto: FindAllSubscriptionFeaturesDto,
  ): Promise<
    | FindAllSubscriptionFeaturesResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionFeaturesResponseDto>
  > {
    return this.subscriptionsFeaturesCoreService.findAll(
      findAllSubscriptionFeaturesDto,
    );
  }

  async findOne(subscriptionFeaturesId: string): Promise<SubscriptionFeatures> {
    return await this.subscriptionsFeaturesCoreService.findOne(
      subscriptionFeaturesId,
    );
  }

  async update(
    updateSubscriptionFeaturesDto: UpdateSubscriptionFeaturesDto,
  ): Promise<UpdateSubscriptionFeaturesResponseDto> {
    return this.subscriptionsFeaturesCoreService.update(
      updateSubscriptionFeaturesDto,
    );
  }

  async updateStatus(
    updateSubscriptionFeaturesStatusDto: UpdateSubscriptionFeaturesStatusDto,
  ): Promise<UpdateSubscriptionFeaturesStatusResponseDto> {
    return this.subscriptionsFeaturesCoreService.updateStatus(
      updateSubscriptionFeaturesStatusDto,
    );
  }
}
