import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { SubscribersService } from './services';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateSubscriberRequest,
  FindSubscribersWithNaturalPersonsRequest,
  FindUserByIdRequest,
  FindUserByUsernameRequest,
  UpdateUserRequest,
  SetPasswordRequest,
  ValidateSubscriberAlertLevelRequest,
  DeleteSubscriberRequest,
  UserProfileResponseDto,
  FindSubscribersWithNaturalPersonsResponseDto,
  ValidateSubscriberAlertLevelResponseDto,
  SubscriberInfoResponseDto,
} from 'src/common/dto';
import {
  FindOneUsernameResponseDto,
  FindOneSubscriberByIdResponseDto,
  CreateSubscriberResponseDto,
  GetSubscribersByBusinessDto,
  ValidateParentCompanyUserDto,
  ValidateParentCompanyUserResponseDto,
} from './dto';

@Controller()
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @MessagePattern('subscribers.checkActiveSubscriptionsByNaturalPersonId')
  checkActiveSubscriptionsByNaturalPersonId(
    @Payload('naturalPersonId', ParseUUIDPipe) naturalPersonId: string,
  ): Promise<boolean> {
    return this.subscribersService.checkActiveSubscriptionsByNaturalPersonId(
      naturalPersonId,
    );
  }

  @GrpcMethod('SubscribersService', 'RegisterSubscriber')
  async registerSubscriber(
    data: CreateSubscriberRequest,
  ): Promise<CreateSubscriberResponseDto> {
    return await this.subscribersService.create(data);
  }

  @GrpcMethod('SubscribersService', 'FindUserByUsername')
  async findUserByUsername(
    data: FindUserByUsernameRequest,
  ): Promise<FindOneUsernameResponseDto> {
    return await this.subscribersService.findOneByUsername(
      data.username,
      data.domain,
      data.service,
    );
  }

  @GrpcMethod('SubscribersService', 'FindUserById')
  async findUserById(
    data: FindUserByIdRequest,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    return await this.subscribersService.findOneBySubscriberId(
      data.subscriberId,
    );
  }

  @GrpcMethod('SubscribersService', 'FindUserProfile')
  async findUserProfile(
    data: FindUserByIdRequest,
  ): Promise<UserProfileResponseDto | null> {
    return await this.subscribersService.findOneBySubscriberIdWithLogin(
      data.subscriberId,
      data.service,
    );
  }

  @GrpcMethod('SubscribersService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<UserProfileResponseDto> {
    return await this.subscribersService.update(data.subscriberId, data);
  }

  @GrpcMethod('SubscribersService', 'GetSubscriberInfo')
  async getSubscribersInfo(
    data: FindUserByIdRequest,
  ): Promise<SubscriberInfoResponseDto> {
    return await this.subscribersService.getSubscriberInfo(
      data.subscriberId,
      data.service,
    );
  }

  @GrpcMethod('SubscribersService', 'FindSubscribersWithNaturalPersons')
  async findSubscribersWithNaturalPersons(
    data: FindSubscribersWithNaturalPersonsRequest,
  ): Promise<FindSubscribersWithNaturalPersonsResponseDto> {
    return await this.subscribersService.findSubscribersWithNaturalPersons({
      subscriptionDetailId: data.subscriptionDetailId,
      page: data.page,
      limit: data.limit,
      term: data.term,
      subscriberIds: data.subscriberIds,
    });
  }

  @MessagePattern('subscribers.deleteSubscribersAlternal')
  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    return await this.subscribersService.deleteSubscribersAlternal();
  }

  @GrpcMethod('SubscribersService', 'SetPassword')
  async setPassword(
    data: SetPasswordRequest,
  ): Promise<{ success: boolean; message: string }> {
    return await this.subscribersService.setPassword(
      data.subscriberId,
      data.hashedPassword,
    );
  }

  @GrpcMethod('SubscribersService', 'ValidateSubscriberAlertLevel')
  async validateSubscriberAlertLevel(
    data: ValidateSubscriberAlertLevelRequest,
  ): Promise<ValidateSubscriberAlertLevelResponseDto> {
    const result = await this.subscribersService.validateSubscriberAlertLevel(
      data.subscriberIds,
      data.levelAlertCode,
    );
    return { data: result };
  }

  @GrpcMethod('SubscribersService', 'DeleteSubscriber')
  async deleteSubscriber(
    data: DeleteSubscriberRequest,
  ): Promise<{ message: string }> {
    return await this.subscribersService.deleteSubscriber(data.subscriberId);
  }

  @GrpcMethod('SubscribersService', 'GetSubscribersByBusiness')
  async getSubscribersByBusiness(data: GetSubscribersByBusinessDto) {
    return await this.subscribersService.getSubscribersByBusiness(data);
  }

  @GrpcMethod('SubscribersService', 'RegisterSubscriberAlternal')
  async registerSubscriberAlternal(data: CreateSubscriberRequest) {
    return await this.subscribersService.registerSubscriberAlternal(data);
  }

  @GrpcMethod('SubscribersService', 'ValidateParentCompanyUser')
  async validateParentCompanyUser(
    data: ValidateParentCompanyUserDto,
  ): Promise<ValidateParentCompanyUserResponseDto> {
    return await this.subscribersService.validateParentCompanyUser(data);
  }
}
