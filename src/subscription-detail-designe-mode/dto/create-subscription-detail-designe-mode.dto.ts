import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateSubscriptionDetailDesigneModeDto {
  @IsUUID('4', {
    message: 'El campo subscriptionDetailId debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'El campo subscriptionDetailId no puede estar vacío.',
  })
  subscriptionDetailId: string;

  @IsUUID('4', {
    message: 'El campo designerModeId debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'El campo designerModeId no puede estar vacío.' })
  designerModeId: string;

  @IsBoolean({ message: 'El campo isPrimary debe ser un booleano.' })
  @IsOptional()
  isPrimary?: boolean;

  @IsBoolean({ message: 'El campo isActive debe ser un booleano.' })
  @IsOptional()
  isActive?: boolean;
}
