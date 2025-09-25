import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '../entities/subscriptions-service.entity';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from '../dto/find-all-subscription-service.dto';
import {
  CreateSubscriptionsServiceDto,
  CreateSubscriptionsServiceResponseDto,
} from '../dto/create-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceDto,
  UpdateSubscriptionsServiceResponseDto,
} from '../dto/update-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceStatusDto,
  UpdateSubscriptionsServiceStatusResponseDto,
} from '../dto/update-subscriptions-service-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsServicesCoreService } from './subscriptions-services-core.service';

@Injectable()
export class SubscriptionsServicesService {
  constructor(
    private readonly subscriptionsServicesCoreService: SubscriptionsServicesCoreService,
  ) {}

  async create(
    createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ): Promise<CreateSubscriptionsServiceResponseDto> {
    return this.subscriptionsServicesCoreService.create(
      createSubscriptionsServiceDto,
    );
  }

  async findAll(
    findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<
    | FindAllSubscriptionsServiceResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsServiceResponseDto>
  > {
    return this.subscriptionsServicesCoreService.findAll(
      findAllSubscriptionsServiceDto,
    );
  }

  async findOne(subscriptionsServiceId: string): Promise<SubscriptionsService> {
    return this.subscriptionsServicesCoreService.findOne(
      subscriptionsServiceId,
    );
  }

  async update(
    updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ): Promise<UpdateSubscriptionsServiceResponseDto> {
    return this.subscriptionsServicesCoreService.update(
      updateSubscriptionsServiceDto,
    );
  }

  async updateStatus(
    updateSubscriptionsServiceStatusDto: UpdateSubscriptionsServiceStatusDto,
  ): Promise<UpdateSubscriptionsServiceStatusResponseDto> {
    return this.subscriptionsServicesCoreService.updateStatus(
      updateSubscriptionsServiceStatusDto,
    );
  }
}
