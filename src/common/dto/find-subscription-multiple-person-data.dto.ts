import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class FindSubscriptionMultiplePersonDataDto {
  @IsArray({ message: 'personIds debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'personIds no puede estar vacío' })
  @IsString({
    each: true,
    message: 'Cada personId debe ser una cadena de texto',
  })
  personIds: string[];
}

export class FindSubscriptionMultiplePersonDataResponseDto {
  personId: string;
  fullName: string;
  documentNumber: string;
}
