import { FindOneUsernameResponseDto } from '../dto/find-one-username.dto';
import { Subscriber } from '../entities/subscriber.entity';

export const formatFindOneUsernameResponse = (
  subscriber: Subscriber,
): FindOneUsernameResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    services: subscriber.subscriptionsBussine.subscriptionDetail.map(
      (subscriptionDetail) => subscriptionDetail.subscriptionsService.code,
    ),
    roles: subscriber.subscriberRoles?.map((role) => role.role.code) || [],
    twoFactorSecret: subscriber.twoFactorSecret || undefined,
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine.subscription.subscriptionId,
      subscriptionBussineId:
        subscriber.subscriptionsBussine.subscriptionBussineId,
      status: subscriber.subscriptionsBussine.subscription.status,
    },
  };
};
