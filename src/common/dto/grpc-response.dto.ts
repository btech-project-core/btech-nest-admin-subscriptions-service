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
