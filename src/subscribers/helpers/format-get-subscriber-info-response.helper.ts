import { Subscriber } from '../entities';
import {
  NaturalPersonResponseDto,
  SubscriberInfoResponseDto,
  PersonResponseDto,
} from 'src/common/dto';

export const formatSubscriberInfoResponse = (
  subscriber: Subscriber,
  naturalPerson: NaturalPersonResponseDto,
  subscriptionPersonData: PersonResponseDto,
): SubscriberInfoResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles:
      subscriber.subscribersSubscriptionDetails?.flatMap(
        (subDetail) =>
          subDetail.subscriberRoles?.map((role) => role.role.code) || [],
      ) || [],
    naturalPerson: {
      naturalPersonId: naturalPerson.naturalPersonId,
      personId: naturalPerson.personId,
      fullName: naturalPerson.fullName,
      paternalSurname: naturalPerson.paternalSurname,
      maternalSurname: naturalPerson.maternalSurname,
      documentNumber: naturalPerson.documentNumber,
      documentType: naturalPerson.documentType,
      personInformation: naturalPerson.personInformation,
    },
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine?.subscription?.subscriptionId || '',
      subscriptionBussineId:
        subscriber.subscriptionsBussine?.subscriptionBussineId || '',
      subscriptionDetailId:
        subscriber.subscriptionsBussine?.subscriptionDetail[0]
          ?.subscriptionDetailId || '',
      status: subscriber.subscriptionsBussine?.subscription?.status || '',
      initialDate:
        subscriber.subscriptionsBussine?.subscription?.initialDate?.toISOString() ||
        '',
      finalDate:
        subscriber.subscriptionsBussine?.subscription?.finalDate?.toISOString() ||
        '',
      url: subscriber.subscriptionsBussine?.subscription?.url || null,
      person: {
        personId: subscriptionPersonData.personId,
        fullName: subscriptionPersonData.fullName,
      },
    },
  };
};
