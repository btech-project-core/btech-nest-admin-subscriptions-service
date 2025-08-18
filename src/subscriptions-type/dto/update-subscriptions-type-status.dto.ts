import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubscriptionsTypeStatusDto {
  @IsNotEmpty({
    message: 'El ID del tipo de suscripción es un campo obligatorio',
  })
  @IsString({
    message: 'El ID del tipo de suscripción debe ser un texto válido',
  })
  subscriptionTypeId: string;

  @IsNotEmpty({ message: 'El estado es un campo obligatorio' })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive: boolean;
}

export class UpdateSubscriptionsTypeStatusResponseDto {
  message: string;
}
