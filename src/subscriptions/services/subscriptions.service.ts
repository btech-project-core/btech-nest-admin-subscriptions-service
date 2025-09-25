import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionDto,
  FindAllSubscriptionResponseDto,
} from '../dto/find-all-subscription.dto';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { SubscriptionsCoreService } from './subscriptions-core.service';
import { SubscriptionsValidateService } from './subscriptions-validate.service';
import { SubscriptionsCustomService } from './subscriptions-custom.service';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsCoreService: SubscriptionsCoreService,
    private readonly subscriptionsValidateService: SubscriptionsValidateService,
    private readonly subscriptionsCustomService: SubscriptionsCustomService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    return this.subscriptionsCoreService.create(createSubscriptionDto);
  }

  async findAll(
    findAllSubscriptionDto: FindAllSubscriptionDto,
  ): Promise<PaginationResponseDto<Subscription>> {
    return this.subscriptionsCoreService.findAll(findAllSubscriptionDto);
  }

  async validateUsersWithSubscription(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    return this.subscriptionsCustomService.validateUsersWithSubscription(file);
  }

  async checkActiveSubscriptionsByPersonId(personId: string): Promise<boolean> {
    return this.subscriptionsValidateService.checkActiveSubscriptionsByPersonId(
      personId,
    );
  }
}
