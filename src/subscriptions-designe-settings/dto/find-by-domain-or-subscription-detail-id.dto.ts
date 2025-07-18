import { IsOptional, IsString } from 'class-validator';

export class FindByDomainOrSubscriptionDetailIdDto {
  @IsString({ message: 'El campo domain debe ser una cadena de caracteres' })
  @IsOptional()
  domain?: string;

  @IsString({
    message: 'El campo subscriptionDetailId debe ser una cadena de caracteres',
  })
  @IsOptional()
  subscriptionDetailId?: string;
}

export class FindByDomainOrSubscriptionDetailIdResponseDtoItem {
  subscriptionsDesigneSettingId: string | undefined;
  mode: string | undefined;
  url: string | undefined;
  brandOne: string | undefined;
  brandTwo: string | undefined;
  brandThree: string | undefined;
  brandFour: string | undefined;
  primaryColor: string | undefined;
  secondaryColor: string | undefined;
  baseColor: string | undefined;
  infoColor: string | undefined;
  warningColor: string | undefined;
  successColor: string | undefined;
  errorColor: string | undefined;
  backgroundColor: string | undefined;
  surfaceColor: string | undefined;
  onPrimaryColor: string | undefined;
  onSecondaryColor: string | undefined;
  onBackgroundColor: string | undefined;
  onSurfaceColor: string | undefined;
  letterFont: string | undefined;
}

export class FindByDomainOrSubscriptionDetailIdResponseDto {
  configurations: FindByDomainOrSubscriptionDetailIdResponseDtoItem[];
}
