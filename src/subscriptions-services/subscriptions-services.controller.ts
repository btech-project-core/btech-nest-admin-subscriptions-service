import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsServicesService } from './subscriptions-services.service';
import { FindAllSubscriptionsServiceDto } from './dto/find-all-subscription-service.dto';

@Controller()
export class SubscriptionsServicesController {
  constructor(
    private readonly subscriptionsServicesService: SubscriptionsServicesService,
  ) {}

  @MessagePattern('subscriptionsServices.findAll')
  findAll(
    @Payload() findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ) {
    return this.subscriptionsServicesService.findAll(
      findAllSubscriptionsServiceDto,
    );
  }
}
