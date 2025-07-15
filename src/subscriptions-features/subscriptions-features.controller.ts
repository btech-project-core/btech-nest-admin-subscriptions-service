import { Controller } from '@nestjs/common';
import { SubscriptionsFeaturesService } from './subscriptions-features.service';

@Controller()
export class SubscriptionsFeaturesController {
  constructor(private readonly subscriptionsFeaturesService: SubscriptionsFeaturesService) {}
}
