import { Injectable } from '@nestjs/common';
import { SubscriptionsDesigneSettingsCustomService } from './subscriptions-designe-settings-custom.service';
import { FindByDomainOrSubscriptionDetailIdResponseDto } from '../dto/find-by-domain-or-subscription-detail-id.dto';

@Injectable()
export class SubscriptionsDesigneSettingsService {
  constructor(
    private readonly subscriptionsDesigneSettingsCustomService: SubscriptionsDesigneSettingsCustomService,
  ) {}
  async findByDomainOrSubscriptionDetailId(
    domain: string,
  ): Promise<FindByDomainOrSubscriptionDetailIdResponseDto> {
    return this.subscriptionsDesigneSettingsCustomService.findByDomainOrSubscriptionDetailId(
      domain,
    );
  }
}
