import { Controller } from '@nestjs/common';
import { SubscriptionsBussinesService } from './subscriptions-bussines.service';

@Controller()
export class SubscriptionsBussinesController {
  constructor(
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
  ) {}
}
