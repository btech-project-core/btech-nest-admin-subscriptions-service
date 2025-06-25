import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsBussinesService } from './services/subscriptions-bussines.service';
import { SubscriptionsDetailsService } from './services/subscriptions-details.service';

@Controller()
export class SubscriptionsBussinesController {
  constructor(
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
    private readonly subscriptionsDetailsService: SubscriptionsDetailsService,
  ) {}

  @MessagePattern('findBySubscriptionsBussineId')
  create(
    @Payload('subscriptionBussineId', ParseUUIDPipe)
    subscriptionBussineId: string,
  ) {
    return this.subscriptionsDetailsService.findBySubscriptionsBussineId(
      subscriptionBussineId,
    );
  }
}
