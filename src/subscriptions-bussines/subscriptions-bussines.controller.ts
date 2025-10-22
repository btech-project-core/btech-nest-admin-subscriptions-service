import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionsBussinesService } from './services/subscriptions-bussines.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateSubscriptionsBussineAlternalDto,
  CreateSubscriptionsBussineAlternalResponseDto,
} from './dto';

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

  @MessagePattern('subscriptionBussines.createAlternal')
  async createAlternal(
    @Payload() dto: CreateSubscriptionsBussineAlternalDto,
  ): Promise<CreateSubscriptionsBussineAlternalResponseDto> {
    return this.subscriptionsBussinesService.createAlternal(dto);
  }
}
