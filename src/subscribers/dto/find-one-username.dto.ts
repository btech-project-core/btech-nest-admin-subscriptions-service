import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';

export class FindOneUsernameResponseDto {
  subscriberId: string;
  username: string;
  isTwoFactorEnabled: boolean;
  roles: string[];
  services: string[];
  twoFactorSecret?: string;
  subscription: FindOneUsernameSubscriptionResponsDto;
}

export class FindOneUsernameSubscriptionResponsDto {
  subscriptionId: string;
  subscriptionBussineId: string;
  status: StatusSubscription;
}
