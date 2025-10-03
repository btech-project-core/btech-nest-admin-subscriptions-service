import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { FindMultipleNaturalPersonsResponseDto } from 'src/common/dto/find-multiple-natural-persons.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindSubscribersWithNaturalPersonsDto extends PaginationDto {
  @IsString({
    message: 'El campo subscriptionDetailId debe ser una cadena de caracteres.',
  })
  @IsUUID('4', {
    message: 'El campo subscriptionDetailId debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'El campo subscriptionDetailId no puede estar vacío.',
  })
  subscriptionDetailId: string;

  @IsOptional()
  @IsString({
    message: 'El campo term debe ser una cadena de caracteres.',
  })
  term?: string;

  @IsArray({
    message: 'El campo subscriberIds debe ser un array.',
  })
  @IsString({
    each: true,
    message: 'Cada subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'El campo subscriberIds no puede estar vacío.',
  })
  subscriberIds: string[];
}

export class SubscriberWithNaturalPersonDto {
  subscriberId: string;
  username: string;
  naturalPerson: FindMultipleNaturalPersonsResponseDto;
}
