import { IsString, MaxLength, MinLength } from 'class-validator';
import { FindAllSubscriptionsServiceResponseDto } from './find-all-subscription-service.dto';

export class CreateSubscriptionsServiceDto {
  @IsString({
    message:
      'El código del servicio de suscripción debe ser una cadena de texto',
  })
  @MinLength(3, {
    message:
      'El código del servicio de suscripción debe tener al menos 3 caracteres',
  })
  @MaxLength(3, {
    message:
      'El código del servicio de suscripción no puede exceder 3 caracteres',
  })
  code: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  @MaxLength(65, { message: 'La descripción no puede exceder 65 caracteres' })
  description: string;
}

export class CreateSubscriptionsServiceResponseDto extends FindAllSubscriptionsServiceResponseDto {}
