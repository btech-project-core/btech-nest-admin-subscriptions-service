import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSubscriptionsTypeDto {
  @IsNotEmpty({
    message: 'La descripción del tipo de suscripción es un campo obligatorio',
  })
  @IsString({
    message: 'La descripción del tipo de suscripción debe ser un texto válido',
  })
  @Length(1, 25, {
    message:
      'La descripción del tipo de suscripción no puede exceder 25 caracteres',
  })
  description: string;
}

export class CreateSubscriptionsTypeResponseDto {
  subscriptionTypeId: string;
  description: string;
  isActive: boolean;
}
