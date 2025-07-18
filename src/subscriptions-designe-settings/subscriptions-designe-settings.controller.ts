import { Controller } from '@nestjs/common';
import { SubscriptionsDesigneSettingsService } from './subscriptions-designe-settings.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindByDomainOrSubscriptionDetailIdDto,
  FindByDomainOrSubscriptionDetailIdResponseDto,
} from './dto/find-by-domain-or-subscription-detail-id.dto';

@Controller()
export class SubscriptionsDesigneSettingsController {
  constructor(
    private readonly subscriptionsDesigneSettingsService: SubscriptionsDesigneSettingsService,
  ) {}

  @GrpcMethod('AdminSubscriptionsService', 'FindByDomainOrSubscriptionDetailId')
  async findByDomainOrSubscriptionDetailId(
    data: FindByDomainOrSubscriptionDetailIdDto,
  ): Promise<FindByDomainOrSubscriptionDetailIdResponseDto> {
    return await this.subscriptionsDesigneSettingsService.findByDomainOrSubscriptionDetailId(
      data.domain,
      data.subscriptionDetailId,
    );
  }
}
