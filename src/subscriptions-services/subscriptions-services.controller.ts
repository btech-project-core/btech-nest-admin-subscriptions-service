import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsServicesService } from './subscriptions-services.service';
import { CreateSubscriptionsServiceDto } from './dto/create-subscriptions-service.dto';
import { UpdateSubscriptionsServiceDto } from './dto/update-subscriptions-service.dto';

@Controller()
export class SubscriptionsServicesController {
  constructor(
    private readonly subscriptionsServicesService: SubscriptionsServicesService,
  ) {}

  @MessagePattern('createSubscriptionsService')
  create(
    @Payload() createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ) {
    return this.subscriptionsServicesService.create(
      createSubscriptionsServiceDto,
    );
  }

  @MessagePattern('findAllSubscriptionsServices')
  findAll() {
    return this.subscriptionsServicesService.findAll();
  }

  @MessagePattern('findOneSubscriptionsService')
  findOne(@Payload() id: number) {
    return this.subscriptionsServicesService.findOne(id);
  }

  @MessagePattern('updateSubscriptionsService')
  update(
    @Payload() updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ) {
    return this.subscriptionsServicesService.update(
      updateSubscriptionsServiceDto.id,
      updateSubscriptionsServiceDto,
    );
  }

  @MessagePattern('removeSubscriptionsService')
  remove(@Payload() id: number) {
    return this.subscriptionsServicesService.remove(id);
  }
}
