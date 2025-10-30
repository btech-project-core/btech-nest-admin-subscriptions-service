import { IsNotEmpty, IsString } from 'class-validator';
import { PersonInformationResponseDto } from './person-information.dto';

export class DocumentIdentityTypeResponseDto {
  documentIdentityTypeId: string;
  description: string;
  abbreviation: string;
}

export class FindOnePersonResponseDto {
  personId: string;
  documentNumber: string;
  isActive: boolean;
  personInformation: PersonInformationResponseDto[];
  documentIdentityType: DocumentIdentityTypeResponseDto;
}

export class FindJuridicalPersonByPersonIdDto {
  @IsString({ message: 'El personId no es válido' })
  @IsNotEmpty({ message: 'El personId no puede estar vacío' })
  personId: string;
}

export class FindJuridicalPersonByPersonIdResponseDto {
  juridicalPersonId: string;
  comercialName: string;
  legalName: string;
  person: FindOnePersonResponseDto;
}
