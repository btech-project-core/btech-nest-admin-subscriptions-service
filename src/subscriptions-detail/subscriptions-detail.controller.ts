import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SubscriptionsDetailService } from './services/subscriptions-detail.service';
import { FindDomainsDto } from './dto/find-domains.dto';
import { SubscriptionsDetailFeaturesService } from './services/subscriptions-detail-features.service';

@Controller()
export class SubscriptionsDetailController {
  constructor(
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
    private readonly subscriptionsDetailFeaturesService: SubscriptionsDetailFeaturesService,
  ) {}
  @GrpcMethod('SubscriptionDetailFeaturesService', 'FindDomains')
  async findDomains(findDomainsDto: FindDomainsDto) {
    return await this.subscriptionsDetailFeaturesService.findActiveDomains(
      findDomainsDto.service,
    );
  }
}
