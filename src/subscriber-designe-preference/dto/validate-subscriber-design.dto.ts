import { IsNotEmpty, IsUUID } from 'class-validator';

export class ValidateSubscriberDesignDto {
  @IsNotEmpty({
    message: 'El ID del suscriptor es un campo obligatorio',
  })
  @IsUUID('4', {
    message: 'El ID del suscriptor debe ser un UUID válido',
  })
  subscriberId: string;
}

export class ValidateSubscriberDesignResponseDto {
  hasCustomDesign: boolean;
  designCode?: string;
}
