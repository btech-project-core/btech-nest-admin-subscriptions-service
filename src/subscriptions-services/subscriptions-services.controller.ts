import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsServicesService } from './subscriptions-services.service';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from './dto/find-all-subscription-service.dto';
import {
  CreateSubscriptionsServiceDto,
  CreateSubscriptionsServiceResponseDto,
} from './dto/create-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceDto,
  UpdateSubscriptionsServiceResponseDto,
} from './dto/update-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceStatusDto,
  UpdateSubscriptionsServiceStatusResponseDto,
} from './dto/update-subscriptions-service-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Controller()
export class SubscriptionsServicesController {
  constructor(
    private readonly subscriptionsServicesService: SubscriptionsServicesService,
  ) {}

  @MessagePattern('subscriptionsServices.create')
  async create(
    @Payload() createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ): Promise<CreateSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesService.create(
      createSubscriptionsServiceDto,
    );
  }

  @MessagePattern('subscriptionsServices.findAll')
  async findAll(
    @Payload() findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<
    | FindAllSubscriptionsServiceResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsServiceResponseDto>
  > {
    return await this.subscriptionsServicesService.findAll(
      findAllSubscriptionsServiceDto,
    );
  }

  @MessagePattern('subscriptionsServices.findOne')
  async findOne(
    @Payload('subscriptionsServiceId', ParseUUIDPipe)
    subscriptionsServiceId: string,
  ): Promise<FindAllSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesService.findOne(
      subscriptionsServiceId,
    );
  }

  @MessagePattern('subscriptionsServices.update')
  async update(
    @Payload() updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ): Promise<UpdateSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesService.update(
      updateSubscriptionsServiceDto,
    );
  }

  @MessagePattern('subscriptionsServices.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateSubscriptionsServiceStatusDto,
  ): Promise<UpdateSubscriptionsServiceStatusResponseDto> {
    return await this.subscriptionsServicesService.updateStatus(
      updateStatusDto,
    );
  }
}
