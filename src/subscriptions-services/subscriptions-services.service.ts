import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsServiceDto } from './dto/create-subscriptions-service.dto';
import { UpdateSubscriptionsServiceDto } from './dto/update-subscriptions-service.dto';

@Injectable()
export class SubscriptionsServicesService {
  create(createSubscriptionsServiceDto: CreateSubscriptionsServiceDto) {
    return 'This action adds a new subscriptionsService';
  }

  findAll() {
    return `This action returns all subscriptionsServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionsService`;
  }

  update(id: number, updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto) {
    return `This action updates a #${id} subscriptionsService`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionsService`;
  }
}
