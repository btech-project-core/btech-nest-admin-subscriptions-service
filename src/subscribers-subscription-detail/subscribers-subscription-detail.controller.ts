import { Controller } from '@nestjs/common';
import { SubscribersSubscriptionDetailService } from './services/subscribers-subscription-detail.service';

@Controller()
export class SubscribersSubscriptionDetailController {
  constructor(
    private readonly subscribersSubscriptionDetailService: SubscribersSubscriptionDetailService,
  ) {}

  // Los métodos del controller se implementarán según los requerimientos específicos
}
