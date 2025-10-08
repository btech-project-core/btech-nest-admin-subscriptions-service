import { FindMultipleNaturalPersonsResponseDto } from './find-multiple-natural-persons.dto';

export class SubscriberWithNaturalPersonDataDto {
  subscriberId: string;
  username: string;
  naturalPerson: FindMultipleNaturalPersonsResponseDto;
}

export class FindSubscribersWithNaturalPersonsResponseDto {
  data: SubscriberWithNaturalPersonDataDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SubscriberAlertLevelValidationDto {
  subscriberId: string;
  hasAlertLevel: boolean;
  alertMinutesBefore?: number;
  subscriptionDetailId?: string;
}

export class ValidateSubscriberAlertLevelResponseDto {
  data: SubscriberAlertLevelValidationDto[];
}
