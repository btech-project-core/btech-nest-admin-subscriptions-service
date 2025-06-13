import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsTypeDto } from './dto/create-subscriptions-type.dto';
import { UpdateSubscriptionsTypeDto } from './dto/update-subscriptions-type.dto';

@Injectable()
export class SubscriptionsTypeService {
  create(createSubscriptionsTypeDto: CreateSubscriptionsTypeDto) {
    return 'This action adds a new subscriptionsType';
  }

  findAll() {
    return `This action returns all subscriptionsType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionsType`;
  }

  update(id: number, updateSubscriptionsTypeDto: UpdateSubscriptionsTypeDto) {
    return `This action updates a #${id} subscriptionsType`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionsType`;
  }
}
