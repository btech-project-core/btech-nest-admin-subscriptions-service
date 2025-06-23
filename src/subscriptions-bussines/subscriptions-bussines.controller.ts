import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsBussinesService } from './subscriptions-bussines.service';
import { CreateSubscriptionsBussineDto } from './dto/create-subscriptions-bussine.dto';
import { UpdateSubscriptionsBussineDto } from './dto/update-subscriptions-bussine.dto';

@Controller()
export class SubscriptionsBussinesController {
  constructor(private readonly subscriptionsBussinesService: SubscriptionsBussinesService) {}

  @MessagePattern('createSubscriptionsBussine')
  create(@Payload() createSubscriptionsBussineDto: CreateSubscriptionsBussineDto) {
    return this.subscriptionsBussinesService.create(createSubscriptionsBussineDto);
  }

  @MessagePattern('findAllSubscriptionsBussines')
  findAll() {
    return this.subscriptionsBussinesService.findAll();
  }

  @MessagePattern('findOneSubscriptionsBussine')
  findOne(@Payload() id: number) {
    return this.subscriptionsBussinesService.findOne(id);
  }

  @MessagePattern('updateSubscriptionsBussine')
  update(@Payload() updateSubscriptionsBussineDto: UpdateSubscriptionsBussineDto) {
    return this.subscriptionsBussinesService.update(updateSubscriptionsBussineDto.id, updateSubscriptionsBussineDto);
  }

  @MessagePattern('removeSubscriptionsBussine')
  remove(@Payload() id: number) {
    return this.subscriptionsBussinesService.remove(id);
  }
}
