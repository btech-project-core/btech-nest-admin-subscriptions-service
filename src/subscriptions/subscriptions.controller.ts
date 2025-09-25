import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsService } from './services/subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { FindAllSubscriptionDto } from './dto/find-all-subscription.dto';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { createMulterFile } from 'src/common/helpers/create-multer-file.helper';
import { FileDto } from 'src/common/dto/file.dto';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @MessagePattern('subscriptions.create')
  create(@Payload() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @MessagePattern('subscriptions.findAll')
  findAll(@Payload() findAllSubscriptionDto: FindAllSubscriptionDto) {
    return this.subscriptionsService.findAll(findAllSubscriptionDto);
  }

  @MessagePattern('subscriptions.validateUsersWithSubscription')
  validateUsersWithSubscription(
    @Payload() file: FileDto,
  ): Promise<UserValidationRresponseDto> {
    const fileData = createMulterFile(file);
    return this.subscriptionsService.validateUsersWithSubscription(fileData);
  }

  @MessagePattern('subscriptions.checkActiveSubscriptionsByPersonId')
  checkActiveSubscriptionsByPersonId(
    @Payload('personId', ParseUUIDPipe) personId: string,
  ): Promise<boolean> {
    return this.subscriptionsService.checkActiveSubscriptionsByPersonId(
      personId,
    );
  }
}
