import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsTypeService } from './services/subscriptions-type.service';
import {
  CreateSubscriptionsTypeDto,
  CreateSubscriptionsTypeResponseDto,
} from './dto/create-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeDto,
  UpdateSubscriptionsTypeResponseDto,
} from './dto/update-subscriptions-type.dto';
import {
  FindAllSubscriptionsTypeDto,
  FindAllSubscriptionsTypeResponseDto,
} from './dto/find-all-subscriptions-type.dto';
import {
  FindOneSubscriptionsTypeDto,
  FindOneSubscriptionsTypeResponseDto,
} from './dto/find-one-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeStatusDto,
  UpdateSubscriptionsTypeStatusResponseDto,
} from './dto/update-subscriptions-type-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Controller()
export class SubscriptionsTypeController {
  constructor(
    private readonly subscriptionsTypeService: SubscriptionsTypeService,
  ) {}

  @MessagePattern('subscriptionsType.create')
  async create(
    @Payload() createSubscriptionsTypeDto: CreateSubscriptionsTypeDto,
  ): Promise<CreateSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeService.create(
      createSubscriptionsTypeDto,
    );
  }

  @MessagePattern('subscriptionsType.findAll')
  async findAll(
    @Payload() findAllDto: FindAllSubscriptionsTypeDto,
  ): Promise<
    | FindAllSubscriptionsTypeResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsTypeResponseDto>
  > {
    return await this.subscriptionsTypeService.findAll(findAllDto);
  }

  @MessagePattern('subscriptionsType.findOne')
  async findOne(
    @Payload() findOneDto: FindOneSubscriptionsTypeDto,
  ): Promise<FindOneSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeService.findOneByDto(findOneDto);
  }

  @MessagePattern('subscriptionsType.update')
  async update(
    @Payload() updateDto: UpdateSubscriptionsTypeDto,
  ): Promise<UpdateSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeService.update(updateDto);
  }

  @MessagePattern('subscriptionsType.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateSubscriptionsTypeStatusDto,
  ): Promise<UpdateSubscriptionsTypeStatusResponseDto> {
    return await this.subscriptionsTypeService.updateStatus(updateStatusDto);
  }
}
