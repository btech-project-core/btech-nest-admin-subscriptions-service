import { CodeService } from 'src/common/enums/code-service.enum';
import { FindOneUsernameResponseDto } from '../dto/find-one-username.dto';
import { Subscriber } from '../entities/subscriber.entity';

export const formatFindOneUsernameResponse = (
  subscriber: Subscriber,
): FindOneUsernameResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    service: subscriber.subscriptionsBussine.subscriptionDetail[0]
      .subscriptionsService.code as CodeService,
    roles:
      subscriber.subscribersSubscriptionDetails?.flatMap(
        (subDetail) =>
          subDetail.subscriberRoles?.map((role) => role.role.code) || [],
      ) || [],
    password: subscriber.password || undefined,
    twoFactorSecret: subscriber.twoFactorSecret || undefined,
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine.subscription.subscriptionId,
      subscriptionBussineId:
        subscriber.subscriptionsBussine.subscriptionBussineId,
      subscriptionDetailId:
        subscriber.subscriptionsBussine.subscriptionDetail[0]
          .subscriptionDetailId,
      status: subscriber.subscriptionsBussine.subscription.status,
    },
  };
};
