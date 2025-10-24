import { IsBoolean, IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class UpdateSubscriptionFeaturesStatusDto {
  @IsNotEmpty({
    message:
      'El ID de la característica de la suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message:
      'El ID de la característica de la suscripción debe ser un UUID válido',
  })
  subscriptionFeaturesId: string;

  @IsNotEmpty({
    message: 'El ID del detalle de suscripción es un campo obligatorio',
  })
  @IsString({
    message: 'El ID del detalle de suscripción debe ser un texto válido',
  })
  subscriptionDetailId: string;

  @IsNotEmpty({ message: 'El estado es un campo obligatorio' })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive: boolean;
}

export class UpdateSubscriptionFeaturesStatusResponseDto {
  message: string;
}
