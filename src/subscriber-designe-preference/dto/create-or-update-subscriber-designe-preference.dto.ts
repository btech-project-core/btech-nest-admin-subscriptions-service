import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrUpdateSubscriberDesignePreferenceDto {
  @IsNotEmpty({
    message: 'El ID del suscriptor es un campo obligatorio',
  })
  @IsUUID('4', {
    message: 'El ID del suscriptor debe ser un UUID válido',
  })
  subscriberId: string;

  @IsNotEmpty({
    message: 'El ID del modo de diseño es un campo obligatorio',
  })
  @IsUUID('4', {
    message: 'El ID del modo de diseño debe ser un UUID válido',
  })
  subscriptionDetailDesigneModeId: string;
}

export class CreateOrUpdateSubscriberDesignePreferenceResponseDto {
  subscriberDesignePreferenceId: string;
  subscriberId: string;
  subscriptionDetailDesigneModeId: string;
  designCode: string;
}
