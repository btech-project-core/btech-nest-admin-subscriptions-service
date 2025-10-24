import { Injectable } from '@nestjs/common';
import { Subscriber } from '../entities';
import {
  UserProfileResponseDto,
  SubscriberInfoResponseDto,
  PaginationResponseDto,
} from 'src/common/dto';
import {
  FindOneSubscriberByIdResponseDto,
  FindOneUsernameResponseDto,
  FindSubscribersWithNaturalPersonsDto,
  SubscriberWithNaturalPersonDto,
  CreateSubscriberDto,
  CreateSubscriberResponseDto,
  GetSubscribersByBusinessDto,
  GetSubscribersByBusinessResponseDto,
} from '../dto';
import { CodeService } from 'src/common/enums';
import { SubscribersCoreService } from './subscribers-core.service';
import { SubscribersAuthService } from './subscribers-auth.service';
import { SubscribersValidateService } from './subscribers-validate.service';
import { SubscribersCustomService } from './subscribers-custom.service';
import { SubscribersBulkService } from './subscribers-bulk.service';
import { SubscriberAlertLevelValidation } from '../interfaces';

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

  async getSubscriberInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberInfoResponseDto> {
    return await this.subscribersCustomService.getSubscriberInfo(
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

  async setPassword(
    subscriberId: string,
    hashedPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.subscribersAuthService.setPassword(
      subscriberId,
      hashedPassword,
    );
  }

  async validateSubscriberAlertLevel(
    subscriberIds: string[],
    levelAlertCode: string,
  ): Promise<SubscriberAlertLevelValidation[]> {
    return await this.subscribersValidateService.validateSubscriberAlertLevel(
      subscriberIds,
      levelAlertCode,
    );
  }

  async deleteSubscriber(subscriberId: string): Promise<{ message: string }> {
    return await this.subscribersCoreService.delete(subscriberId);
  }

  async getSubscribersByBusiness(
    dto: GetSubscribersByBusinessDto,
  ): Promise<PaginationResponseDto<GetSubscribersByBusinessResponseDto>> {
    return await this.subscribersCustomService.getSubscribersByBusiness(dto);
  }
}
