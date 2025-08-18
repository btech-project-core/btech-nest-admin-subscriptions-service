import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { FindAllSubscriptionFeaturesResponseDto } from './find-all-subscription-features.dto';

export class CreateSubscriptionFeaturesDto {
  @IsNotEmpty({
    message: 'El código de la característica es un campo obligatorio',
  })
  @IsString({
    message: 'El código de la característica debe ser un texto válido',
  })
  @Length(1, 8, {
    message: 'El código de la característica no puede exceder 8 caracteres',
  })
  code: string;

  @IsNotEmpty({
    message: 'La descripción de la característica es un campo obligatorio',
  })
  @IsString({
    message: 'La descripción de la característica no puede estar vacía',
  })
  @Length(1, 65, {
    message:
      'La descripción de la característica no puede exceder 65 caracteres',
  })
  description: string;

  @IsBoolean({ message: 'El campo requerido es un campo booleano' })
  @IsOptional()
  isRequired?: boolean;
}

export class CreateSubscriptionFeaturesResponseDto extends FindAllSubscriptionFeaturesResponseDto {}
