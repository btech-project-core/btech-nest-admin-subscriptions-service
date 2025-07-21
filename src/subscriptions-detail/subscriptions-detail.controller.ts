import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { FindActiveSubscriptionDetailsByBussinesIdDto } from './dto/find-active-subscription-details-by-bussines-id.dto';
import { SubscriptionsDetailService } from './services/subscriptions-detail.service';
import { FindDomainsDto } from './dto/find-domains.dto';
import { SubscriptionsDetailFeaturesService } from './services/subscriptions-detail-features.service';

@Controller()
export class SubscriptionsDetailController {
  constructor(
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
    private readonly subscriptionsDetailFeaturesService: SubscriptionsDetailFeaturesService,
  ) {}
  @MessagePattern('findActiveSubscriptionDetailsByBussinesId')
  async findActiveSubscriptionDetailsByBusinessId(
    @Payload()
    findActiveSubscriptionDetailsByBussinesIdDto: FindActiveSubscriptionDetailsByBussinesIdDto,
  ) {
    return await this.subscriptionsDetailService.findActiveSubscriptionDetailsByBussinesId(
      findActiveSubscriptionDetailsByBussinesIdDto.subscriptionBussineId,
    );
  }

  @GrpcMethod('SubscriptionDetailFeaturesService', 'FindDomains')
  async findDomains(findDomainsDto: FindDomainsDto) {
    return await this.subscriptionsDetailFeaturesService.findActiveDomains(
      findDomainsDto.service,
    );
  }

  @MessagePattern('subscriptionDetailFeatures.findDomains')
  async findDomainsService(@Payload() findDomainsDto: FindDomainsDto) {
    console.log('--------------------------------- service 3', findDomainsDto);
    return await this.subscriptionsDetailFeaturesService.findActiveDomains(
      findDomainsDto.service,
    );
  }
}
