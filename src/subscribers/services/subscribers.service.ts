import { Injectable } from '@nestjs/common';
import { Subscriber } from '../entities/subscriber.entity';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { FindOneUsernameResponseDto } from '../dto/find-one-username.dto';
import { FindOneSubscriberByIdResponseDto } from '../dto/find-one-subscriber-by-id.dto';
import { SubscriberCompleteInfoResponseDto } from 'src/common/dto/subscriber-complete-info.dto';
import {
  FindSubscribersWithNaturalPersonsDto,
  SubscriberWithNaturalPersonDto,
} from '../dto/find-subscribers-with-natural-persons.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  CreateSubscriberDto,
  CreateSubscriberResponseDto,
} from '../dto/create-subscriber.dto';
import { CodeService } from 'src/common/enums/code-service.enum';
import { SubscribersCoreService } from './subscribers-core.service';
import { SubscribersAuthService } from './subscribers-auth.service';
import { SubscribersValidateService } from './subscribers-validate.service';
import { SubscribersCustomService } from './subscribers-custom.service';
import { SubscribersBulkService } from './subscribers-bulk.service';

@Injectable()
export class SubscribersService {
  constructor(
    private readonly subscribersCoreService: SubscribersCoreService,
    private readonly subscribersAuthService: SubscribersAuthService,
    private readonly subscribersValidateService: SubscribersValidateService,
    private readonly subscribersCustomService: SubscribersCustomService,
    private readonly subscribersBulkService: SubscribersBulkService,
  ) {}

  async create(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    return await this.subscribersCoreService.create(createSubscriberDto);
  }

  async update(
    subscriberId: string,
    updateData: Partial<Subscriber>,
  ): Promise<UserProfileResponseDto> {
    return await this.subscribersCoreService.update(subscriberId, updateData);
  }

  async findOneByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<FindOneUsernameResponseDto> {
    return await this.subscribersAuthService.findOneByUsername(
      username,
      domain,
      service,
    );
  }

  async findOneBySubscriberId(
    subscriberId: string,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    return await this.subscribersCustomService.findOneBySubscriberId(
      subscriberId,
    );
  }

  async findOneBySubscriberIdWithLogin(
    subscriberId: string,
    service?: CodeService,
  ): Promise<UserProfileResponseDto | null> {
    return await this.subscribersAuthService.findOneBySubscriberIdWithLogin(
      subscriberId,
      service,
    );
  }

  async getSubscriberCompleteInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberCompleteInfoResponseDto> {
    return await this.subscribersCustomService.getSubscriberCompleteInfo(
      subscriberId,
      service,
    );
  }

  async checkActiveSubscriptionsByNaturalPersonId(
    naturalPersonId: string,
  ): Promise<boolean> {
    return await this.subscribersValidateService.checkActiveSubscriptionsByNaturalPersonId(
      naturalPersonId,
    );
  }

  async findSubscribersWithNaturalPersons(
    findDto: FindSubscribersWithNaturalPersonsDto,
  ): Promise<PaginationResponseDto<SubscriberWithNaturalPersonDto>> {
    return await this.subscribersBulkService.findSubscribersWithNaturalPersons(
      findDto,
    );
  }

  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    return await this.subscribersCustomService.deleteSubscribersAlternal();
  }
}
