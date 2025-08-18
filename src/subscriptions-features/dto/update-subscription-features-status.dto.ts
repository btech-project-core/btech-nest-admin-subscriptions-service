import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

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

  @IsNotEmpty({ message: 'El estado es un campo obligatorio' })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive: boolean;
}

export class UpdateSubscriptionFeaturesStatusResponseDto {
  message: string;
}
