import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @MessagePattern('createSubscription')
  create(@Payload() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @MessagePattern('findAllSubscriptions')
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @MessagePattern('findOneSubscription')
  findOne(@Payload() id: number) {
    return this.subscriptionsService.findOne(id);
  }

  @MessagePattern('updateSubscription')
  update(@Payload() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(updateSubscriptionDto.id, updateSubscriptionDto);
  }

  @MessagePattern('removeSubscription')
  remove(@Payload() id: number) {
    return this.subscriptionsService.remove(id);
  }
}
