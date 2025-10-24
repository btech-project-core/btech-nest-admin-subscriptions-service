import { GetSubscribersByBusinessResponseDto } from '../dto';
import { Subscriber } from '../entities';
import { FindMultipleNaturalPersonsResponseDto } from 'src/common/dto';

export const formatSubscribersByBusinessResponse = (
  subscriber: Subscriber,
  naturalPerson: FindMultipleNaturalPersonsResponseDto,
): GetSubscribersByBusinessResponseDto => {
  const roles =
    subscriber.subscribersSubscriptionDetails?.flatMap(
      (subDetail) =>
        subDetail.subscriberRoles?.map((role) => role.role.code) || [],
    ) || [];

  return {
    subscriberId: subscriber.subscriberId,
    role: roles,
    fullName: naturalPerson.fullName,
    paternalSurname: naturalPerson.paternalSurname,
    maternalSurname: naturalPerson.maternalSurname,
    documentNumber: naturalPerson.documentNumber,
    documentType: naturalPerson.documentType,
    createdAt: subscriber.createdAt.toISOString(),
    updatedAt: subscriber.updatedAt.toISOString(),
  };
};
