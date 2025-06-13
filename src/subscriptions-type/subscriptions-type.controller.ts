import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsTypeService } from './subscriptions-type.service';
import { CreateSubscriptionsTypeDto } from './dto/create-subscriptions-type.dto';
import { UpdateSubscriptionsTypeDto } from './dto/update-subscriptions-type.dto';

@Controller()
export class SubscriptionsTypeController {
  constructor(private readonly subscriptionsTypeService: SubscriptionsTypeService) {}

  @MessagePattern('createSubscriptionsType')
  create(@Payload() createSubscriptionsTypeDto: CreateSubscriptionsTypeDto) {
    return this.subscriptionsTypeService.create(createSubscriptionsTypeDto);
  }

  @MessagePattern('findAllSubscriptionsType')
  findAll() {
    return this.subscriptionsTypeService.findAll();
  }

  @MessagePattern('findOneSubscriptionsType')
  findOne(@Payload() id: number) {
    return this.subscriptionsTypeService.findOne(id);
  }

  @MessagePattern('updateSubscriptionsType')
  update(@Payload() updateSubscriptionsTypeDto: UpdateSubscriptionsTypeDto) {
    return this.subscriptionsTypeService.update(updateSubscriptionsTypeDto.id, updateSubscriptionsTypeDto);
  }

  @MessagePattern('removeSubscriptionsType')
  remove(@Payload() id: number) {
    return this.subscriptionsTypeService.remove(id);
  }
}
