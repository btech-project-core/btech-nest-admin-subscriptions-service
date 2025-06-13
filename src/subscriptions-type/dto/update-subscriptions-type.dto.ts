import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsTypeDto } from './create-subscriptions-type.dto';

export class UpdateSubscriptionsTypeDto extends PartialType(CreateSubscriptionsTypeDto) {
  id: number;
}
