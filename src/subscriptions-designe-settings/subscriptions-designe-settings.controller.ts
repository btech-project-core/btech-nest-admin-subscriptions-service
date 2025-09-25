import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindByDomainOrSubscriptionDetailIdDto,
  FindByDomainOrSubscriptionDetailIdResponseDto,
} from './dto/find-by-domain-or-subscription-detail-id.dto';
import { SubscriptionsDesigneSettingsService } from './services/subscriptions-designe-settings.service';

@Controller()
export class SubscriptionsDesigneSettingsController {
  constructor(
    private readonly subscriptionsDesigneSettingsService: SubscriptionsDesigneSettingsService,
  ) {}

  @GrpcMethod('SubscribersService', 'FindByDomainOrSubscriptionDetailId')
  async findByDomainOrSubscriptionDetailId(
    data: FindByDomainOrSubscriptionDetailIdDto,
  ): Promise<FindByDomainOrSubscriptionDetailIdResponseDto> {
    return await this.subscriptionsDesigneSettingsService.findByDomainOrSubscriptionDetailId(
      data.domain,
    );
  }
}
