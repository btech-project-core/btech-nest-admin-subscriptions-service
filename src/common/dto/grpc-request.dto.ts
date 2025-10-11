import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CodeService } from '../enums/code-service.enum';
import { Type } from 'class-transformer';

export class FindUserByUsernameRequest {
  @IsString({ message: 'El campo username debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El campo username no puede estar vacío.' })
  username: string;

  @IsString({ message: 'El campo domain debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El campo domain no puede estar vacío.' })
  domain: string;

  @IsEnum(CodeService, { message: 'El campo service debe ser: VDI, STO, SUP' })
  @IsNotEmpty({ message: 'El campo service no puede estar vacío.' })
  service: CodeService;
}

export class FindUserByIdRequest {
  @IsString({
    message: 'El campo subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo subscriberId no puede estar vacío.' })
  subscriberId: string;

  @IsEnum(CodeService, {
    message:
      'El campo service debe ser un código de servicio válido: VDI, STO o SUP.',
  })
  @IsOptional()
  service?: CodeService;
}

export class UpdateUserRequest {
  @IsString({
    message: 'El campo subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo subscriberId no puede estar vacío.' })
  subscriberId: string;

  @IsOptional()
  @IsString({
    message: 'El campo twoFactorSecret debe ser una cadena de caracteres.',
  })
  twoFactorSecret?: string;

  @IsOptional()
  @IsBoolean({
    message: 'El campo isTwoFactorEnabled debe ser un booleano.',
  })
  isTwoFactorEnabled?: boolean;
}

export class FindSubscribersWithNaturalPersonsRequest {
  @IsString({
    message: 'El campo subscriptionDetailId debe ser una cadena de caracteres.',
  })
  @IsUUID('4', {
    message: 'El campo subscriptionDetailId debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'El campo subscriptionDetailId no puede estar vacío.',
  })
  subscriptionDetailId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El campo page debe ser un número entero.' })
  @Min(1, { message: 'El campo page debe ser mayor que 0.' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El campo limit debe ser un número entero.' })
  @Min(1, { message: 'El campo limit debe ser mayor que 0.' })
  limit?: number;

  @IsOptional()
  @IsString({
    message: 'El campo term debe ser una cadena de caracteres.',
  })
  term?: string;

  @IsArray({
    message: 'El campo subscriberIds debe ser un array.',
  })
  @IsString({
    each: true,
    message: 'Cada subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'El campo subscriberIds no puede estar vacío.',
  })
  subscriberIds: string[];
}

export class CreateSubscriberRequest {
  @IsString({
    message: 'El campo username debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo username no puede estar vacío.' })
  username: string;

  @IsString({
    message: 'El campo password debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo password no puede estar vacío.' })
  password: string;

  @IsString({
    message: 'El campo naturalPersonId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'El campo naturalPersonId no puede estar vacío.',
  })
  naturalPersonId: string;

  @IsString({
    message: 'El campo domain debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo domain no puede estar vacío.' })
  domain: string;

  @IsEnum(CodeService, { message: 'El campo service debe ser: VDI, STO, SUP' })
  @IsNotEmpty({ message: 'El campo service no puede estar vacío.' })
  service: CodeService;
}

export class SetPasswordRequest {
  @IsString({
    message: 'El campo subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo subscriberId no puede estar vacío.' })
  subscriberId: string;

  @IsString({
    message: 'El campo hashedPassword debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo hashedPassword no puede estar vacío.' })
  hashedPassword: string;
}

export class ValidateSubscriberAlertLevelRequest {
  @IsArray({
    message: 'El campo subscriberIds debe ser un array.',
  })
  @IsString({
    each: true,
    message: 'Cada subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'El campo subscriberIds no puede estar vacío.',
  })
  subscriberIds: string[];

  @IsString({
    message: 'El campo levelAlertCode debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo levelAlertCode no puede estar vacío.' })
  levelAlertCode: string;
}

export class DeleteSubscriberRequest {
  @IsString({
    message: 'El campo subscriberId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo subscriberId no puede estar vacío.' })
  subscriberId: string;
}
