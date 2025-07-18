import { CodeService } from 'src/common/enums/code-service.enum';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';

export class FindOneUsernameResponseDto {
  subscriberId: string;
  username: string;
  isTwoFactorEnabled: boolean;
  roles: string[];
  service: CodeService;
  twoFactorSecret?: string;
  subscription: FindOneUsernameSubscriptionResponsDto;
}

export class FindOneUsernameSubscriptionResponsDto {
  subscriptionId: string;
  subscriptionBussineId: string;
  subscriptionDetailId: string;
  status: StatusSubscription;
}
