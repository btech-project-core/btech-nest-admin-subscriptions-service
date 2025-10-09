import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSubscriptionDetailDesigneModeDto {
  @IsBoolean({ message: 'El campo isPrimary debe ser un booleano.' })
  @IsOptional()
  isPrimary?: boolean;

  @IsBoolean({ message: 'El campo isActive debe ser un booleano.' })
  @IsOptional()
  isActive?: boolean;
}
