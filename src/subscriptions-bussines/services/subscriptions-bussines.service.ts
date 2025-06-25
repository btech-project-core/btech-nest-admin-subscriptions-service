import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from '../dto/create-subscriptions-bussine.dto';
import { UpdateSubscriptionsBussineDto } from '../dto/update-subscriptions-bussine.dto';

@Injectable()
export class SubscriptionsBussinesService {
  create(createSubscriptionsBussineDto: CreateSubscriptionsBussineDto) {
    return 'This action adds a new subscriptionsBussine';
  }

  findAll() {
    return `This action returns all subscriptionsBussines`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionsBussine`;
  }

  update(id: number, updateSubscriptionsBussineDto: UpdateSubscriptionsBussineDto) {
    return `This action updates a #${id} subscriptionsBussine`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionsBussine`;
  }
}
