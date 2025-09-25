import { Injectable } from '@nestjs/common';
import {
  CreateSubscriptionsTypeDto,
  CreateSubscriptionsTypeResponseDto,
} from '../dto/create-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeDto,
  UpdateSubscriptionsTypeResponseDto,
} from '../dto/update-subscriptions-type.dto';
import {
  FindAllSubscriptionsTypeDto,
  FindAllSubscriptionsTypeResponseDto,
} from '../dto/find-all-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeStatusDto,
  UpdateSubscriptionsTypeStatusResponseDto,
} from '../dto/update-subscriptions-type-status.dto';
import {
  FindOneSubscriptionsTypeDto,
  FindOneSubscriptionsTypeResponseDto,
} from '../dto/find-one-subscriptions-type.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsTypeCoreService } from './subscriptions-type-core.service';

@Injectable()
export class SubscriptionsTypeService {
  constructor(
    private readonly subscriptionsTypeCoreService: SubscriptionsTypeCoreService,
  ) {}

  async create(
    createSubscriptionsTypeDto: CreateSubscriptionsTypeDto,
  ): Promise<CreateSubscriptionsTypeResponseDto> {
    return this.subscriptionsTypeCoreService.create(createSubscriptionsTypeDto);
  }

  async findAll(
    findAllSubscriptionsTypeDto: FindAllSubscriptionsTypeDto,
  ): Promise<
    | FindAllSubscriptionsTypeResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsTypeResponseDto>
  > {
    return this.subscriptionsTypeCoreService.findAll(
      findAllSubscriptionsTypeDto,
    );
  }

  async findOneByDto(
    findOneDto: FindOneSubscriptionsTypeDto,
  ): Promise<FindOneSubscriptionsTypeResponseDto> {
    return this.subscriptionsTypeCoreService.findOneByDto(findOneDto);
  }

  async update(
    updateSubscriptionsTypeDto: UpdateSubscriptionsTypeDto,
  ): Promise<UpdateSubscriptionsTypeResponseDto> {
    return this.subscriptionsTypeCoreService.update(updateSubscriptionsTypeDto);
  }

  async updateStatus(
    updateSubscriptionsTypeStatusDto: UpdateSubscriptionsTypeStatusDto,
  ): Promise<UpdateSubscriptionsTypeStatusResponseDto> {
    return this.subscriptionsTypeCoreService.updateStatus(
      updateSubscriptionsTypeStatusDto,
    );
  }
}
