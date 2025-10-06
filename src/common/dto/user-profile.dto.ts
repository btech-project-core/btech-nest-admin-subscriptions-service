import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { NaturalPersonResponseDto } from './natural-person.dto';
import { PersonResponseDto } from './person.dto';

export class UserProfileDto {
  userId: string;
}

export class UserProfileResponseDto {
  subscriberId: string;
  username: string;
  isTwoFactorEnabled: boolean;
  // twoFactorSecret: string;
  roles: string[];
  naturalPerson: NaturalPersonResponseDto;
  subscription: {
    subscriptionId: string;
    subscriptionBussineId: string;
    subscriptionDetailId: string;
    status: StatusSubscription;
    initialDate: string;
    finalDate: string;
    url?: string | null;
    person: PersonResponseDto;
  };
  hasPassword: boolean;
}
