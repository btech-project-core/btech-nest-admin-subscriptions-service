import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionsDetailService } from './subscriptions-detail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindActiveSubscriptionDetailsByBussinesIdDto } from './dto/find-active-subscription-details-by-bussines-id.dto';

@Controller()
export class SubscriptionsDetailController {
  constructor(
    private readonly subscriptionsDetailService: SubscriptionsDetailService,
  ) {}

  @MessagePattern('findBySubscriptionsBussineId')
  create(
    @Payload('subscriptionBussineId', ParseUUIDPipe)
    subscriptionBussineId: string,
  ) {
    return this.subscriptionsDetailService.findBySubscriptionsBussineId(
      subscriptionBussineId,
    );
  }

  @MessagePattern('findActiveSubscriptionDetailsByBussinesId')
  async findActiveSubscriptionDetailsByBusinessId(
    @Payload()
    findActiveSubscriptionDetailsByBussinesIdDto: FindActiveSubscriptionDetailsByBussinesIdDto,
  ) {
    return await this.subscriptionsDetailService.findActiveSubscriptionDetailsByBussinesId(
      findActiveSubscriptionDetailsByBussinesIdDto.subscriptionBussineId,
    );
  }
}
