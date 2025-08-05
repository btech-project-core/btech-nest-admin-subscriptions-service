import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSubscriptionsServiceStatusDto {
  @IsNotEmpty({
    message: 'El ID del servicio de suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message: 'El ID del servicio de suscripción debe ser una cadena de texto',
  })
  subscriptionsServiceId: string;

  @IsNotEmpty({ message: 'isActive es un campo obligatorio' })
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive: boolean;
}

export class UpdateSubscriptionsServiceStatusResponseDto {
  message: string;
}
