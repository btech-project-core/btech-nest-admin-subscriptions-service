import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { SubscribersService } from './services/subscribers.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateSubscriberRequest,
  FindSubscribersWithNaturalPersonsRequest,
  FindUserByIdRequest,
  FindUserByUsernameRequest,
  GetSubscriberCompleteInfoRequest,
  UpdateUserRequest,
} from 'src/common/dto/grpc-request.dto';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { FindOneUsernameResponseDto } from './dto/find-one-username.dto';
import { FindOneSubscriberByIdResponseDto } from './dto/find-one-subscriber-by-id.dto';
import { SubscriberCompleteInfoResponseDto } from 'src/common/dto/subscriber-complete-info.dto';
import { FindSubscribersWithNaturalPersonsResponseDto } from 'src/common/dto/grpc-response.dto';
import { CreateSubscriberResponseDto } from './dto/create-subscriber.dto';

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

  @GrpcMethod('SubscribersService', 'GetSubscriberCompleteInfo')
  async getSubscriberCompleteInfo(
    data: GetSubscriberCompleteInfoRequest,
  ): Promise<SubscriberCompleteInfoResponseDto> {
    return await this.subscribersService.getSubscriberCompleteInfo(
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
    });
  }
}
