import { FindJuridicalPersonByPersonIdResponseDto } from 'src/common/dto';

export class ClientBusinessDto {
  subscriptionBussineId: string;
  personId: string;
  businessName: string;
  juridicalPerson: FindJuridicalPersonByPersonIdResponseDto;
  subscribersCount: number;
  createdAt: string;
  updatedAt: string;
}

export class GetClientBusinessesResponseDto {
  clientBusinesses: ClientBusinessDto[];
}
