import { IsNotEmpty, IsString } from 'class-validator';

export class FindByDomainDto {
  @IsString({ message: 'El campo domain debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El campo domain no puede estar vacío.' })
  domain: string;
}

export class FindByDomainResponseItemDto {
  subscriptionDetailDesigneModeId?: string;
  mode: string;
  isPrimary: boolean;
  url?: string;
  brandOne?: string;
  brandTwo?: string;
  brandThree?: string;
  brandFour?: string;
  primaryColor?: string;
  secondaryColor?: string;
  baseColor?: string;
  infoColor?: string;
  warningColor?: string;
  successColor?: string;
  errorColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  onPrimaryColor?: string;
  onSecondaryColor?: string;
  onBackgroundColor?: string;
  onSurfaceColor?: string;
  letterFont?: string;
}

export class FindByDomainResponseDto {
  configurations: FindByDomainResponseItemDto[];
}
