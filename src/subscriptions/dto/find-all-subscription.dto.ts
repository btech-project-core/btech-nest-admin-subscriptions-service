import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StatusSubscription } from '../enums/status-subscription.enum';

export class FindAllSubscriptionDto extends PaginationDto {
  term?: string;
  status: StatusSubscription;
}

export class FindAllSubscriptionResponseDto {
  subscriptionId: string;
  personId: string;
  documentNumber: string;
  fullName: string;
  initialDate: Date;
  finalDate: Date;
  contractSigningDate: Date;
  status: StatusSubscription;
}
