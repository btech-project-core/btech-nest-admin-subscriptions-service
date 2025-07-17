import { Controller } from '@nestjs/common';
import { SubscriptionsDesigneSettingsService } from './subscriptions-designe-settings.service';

@Controller()
export class SubscriptionsDesigneSettingsController {
  constructor(
    private readonly subscriptionsDesigneSettingsService: SubscriptionsDesigneSettingsService,
  ) {}
}
