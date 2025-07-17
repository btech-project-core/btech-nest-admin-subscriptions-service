import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CodeService } from '../enums/code-service.enum';

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
