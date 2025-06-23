import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsBussineDto } from './create-subscriptions-bussine.dto';

export class UpdateSubscriptionsBussineDto extends PartialType(CreateSubscriptionsBussineDto) {
  id: number;
}
