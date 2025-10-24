import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionsBussinesService } from './services/subscriptions-bussines.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SubscriptionsBussinesController {
  constructor(
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
  ) {}

  @MessagePattern(
    'subscriptionBussines.checkActiveSubscriptionsByJuridicalPersonId',
  )
  async checkActiveSubscriptionsByJuridicalPersonId(
    @Payload('juridicalPersonId', ParseUUIDPipe) juridicalPersonId: string,
  ): Promise<boolean> {
    return this.subscriptionsBussinesService.checkActiveSubscriptionsByJuridicalPersonId(
      juridicalPersonId,
    );
  }

  @MessagePattern('subscriptionBussines.getClientPersonIds')
  async getClientPersonIds(): Promise<string[]> {
    return this.subscriptionsBussinesService.getClientPersonIds();
  }

  @MessagePattern(
    'subscriptionBussines.findSubscriptionBussineIdBySubscriptionDetailId',
  )
  async findSubscriptionBussineIdBySubscriptionDetailId(
    @Payload('subscriptionDetailId', ParseUUIDPipe)
    subscriptionDetailId: string,
  ): Promise<string> {
    return await this.subscriptionsBussinesService.findSubscriptionBussineIdBySubscriptionDetailId(
      subscriptionDetailId,
    );
  }
}
