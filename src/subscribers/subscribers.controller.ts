import { Controller } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindUserByIdRequest,
  FindUserByUsernameRequest,
  GetSubscriberCompleteInfoRequest,
  UpdateUserRequest,
} from 'src/common/dto/grpc-request.dto';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { FindOneUsernameResponseDto } from './dto/find-one-username.dto';
import { FindOneSubscriberByIdResponseDto } from './dto/find-one-subscriber-by-id.dto';
import { SubscriberCompleteInfoResponseDto } from 'src/common/dto/subscriber-complete-info.dto';

@Controller()
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

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
    return await this.subscribersService.updateSubscriber(
      data.subscriberId,
      data,
    );
  }

  @GrpcMethod('SubscribersService', 'GetSubscriberCompleteInfo')
  async getSubscriberCompleteInfo(
    data: GetSubscriberCompleteInfoRequest,
  ): Promise<SubscriberCompleteInfoResponseDto> {
    console.log('Datos recibidos en getSubscriberCompleteInfo:', data);
    return await this.subscribersService.getSubscriberCompleteInfo(
      data.subscriberId,
      data.service,
    );
  }
}
