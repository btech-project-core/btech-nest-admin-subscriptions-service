import { Subscriber } from '../entities/subscriber.entity';
import { SubscriberCompleteInfoResponseDto } from 'src/common/dto/subscriber-complete-info.dto';
import { PersonResponseDto } from 'src/common/dto/person.dto';
import { NaturalPersonResponseDto } from 'src/common/dto/natural-person.dto';

export const formatSubscriberCompleteInfoResponse = (
  subscriber: Subscriber,
  naturalPerson: NaturalPersonResponseDto,
  subscriptionPersonData: PersonResponseDto,
): SubscriberCompleteInfoResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles: subscriber.subscriberRoles.map((role) => role.role.code),
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
