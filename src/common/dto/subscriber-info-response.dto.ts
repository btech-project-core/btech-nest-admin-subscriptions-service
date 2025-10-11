import { NaturalPersonResponseDto } from './natural-person.dto';

export class SubscriptionInfoDto {
  subscriptionId: string;
  subscriptionBussineId: string;
  subscriptionDetailId: string;
  status: string;
  initialDate: string;
  finalDate: string;
  url?: string | null;
  person: {
    personId: string;
    fullName: string;
  };
}

export class SubscriberInfoResponseDto {
  subscriberId: string;
  username: string;
  isTwoFactorEnabled: boolean;
  roles: string[];
  naturalPerson: NaturalPersonResponseDto;
  subscription: SubscriptionInfoDto;
}
