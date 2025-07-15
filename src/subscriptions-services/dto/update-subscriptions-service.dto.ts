import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsServiceDto } from './create-subscriptions-service.dto';

export class UpdateSubscriptionsServiceDto extends PartialType(CreateSubscriptionsServiceDto) {
  id: number;
}
