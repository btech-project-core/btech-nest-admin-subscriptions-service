import { NaturalPersonResponseDto } from 'src/common/dto/natural-person.dto';
import { Subscriber } from '../entities/subscriber.entity';
import { PersonResponseDto } from 'src/common/dto/person.dto';

export const formatSubscriberWithLoginResponse = (
  subscriber: Subscriber,
  naturalPerson: NaturalPersonResponseDto,
  subscriptionPersonData: PersonResponseDto,
) => {
  const baseResponse = {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles:
      subscriber.subscribersSubscriptionDetails?.flatMap(
        (subDetail) =>
          subDetail.subscriberRoles?.map((role) => role.role.code) || [],
      ) || [],
  };
  return {
    ...baseResponse,
    naturalPerson,
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine?.subscription?.subscriptionId,
      subscriptionBussineId:
        subscriber.subscriptionsBussine?.subscriptionBussineId,
      subscriptionDetailId:
        subscriber.subscriptionsBussine?.subscriptionDetail[0]
          .subscriptionDetailId,
      status: subscriber.subscriptionsBussine.subscription?.status,
      initialDate:
        subscriber.subscriptionsBussine.subscription?.initialDate?.toISOString(),
      finalDate:
        subscriber.subscriptionsBussine.subscription?.finalDate?.toISOString(),
      url: subscriber.subscriptionsBussine.subscription?.url,
      person: subscriptionPersonData,
    },
  };
};
