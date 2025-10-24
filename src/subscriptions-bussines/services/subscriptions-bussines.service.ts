import { Injectable } from '@nestjs/common';
import { SubscriptionsBussinesValidateService } from './subscriptions-bussines-validate.service';
import { SubscriptionsBussinesCustomService } from './subscriptions-bussines-custom.service';

@Injectable()
export class SubscriptionsBussinesService {
  constructor(
    private readonly subscriptionsBussinesValidateService: SubscriptionsBussinesValidateService,
    private readonly subscriptionsBussinesCustomService: SubscriptionsBussinesCustomService,
  ) {}
  async checkActiveSubscriptionsByJuridicalPersonId(
    juridicalPersonId: string,
  ): Promise<boolean> {
    return this.subscriptionsBussinesValidateService.checkActiveSubscriptionsByJuridicalPersonId(
      juridicalPersonId,
    );
  }

  async getClientPersonIds(): Promise<string[]> {
    return this.subscriptionsBussinesCustomService.getClientPersonIds();
  }

  async findSubscriptionBussineIdBySubscriptionDetailId(
    subscriptionDetailId: string,
  ): Promise<string> {
    return this.subscriptionsBussinesCustomService.findSubscriptionBussineIdBySubscriptionDetailId(
      subscriptionDetailId,
    );
  }
}
