export class PersonInformationDto {
  informationType: string;
  description: string;
}

export class NaturalPersonCompleteInfoDto {
  naturalPersonId: string;
  personId: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  documentNumber: string;
  documentType: string;
  personInformation: PersonInformationDto[];
}

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

export class SubscriberCompleteInfoResponseDto {
  subscriberId: string;
  username: string;
  isTwoFactorEnabled: boolean;
  roles: string[];
  naturalPerson: NaturalPersonCompleteInfoDto;
  subscription: SubscriptionInfoDto;
}
