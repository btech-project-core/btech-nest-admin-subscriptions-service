import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CodeService } from 'src/common/enums/code-service.enum';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString({ message: 'El nombre de usuario debe ser un texto válido' })
  @Length(1, 15, {
    message: 'El nombre de usuario debe tener entre 1 y 15 caracteres',
  })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un texto válido' })
  password: string;

  @IsNotEmpty({ message: 'El ID de la persona natural es requerida' })
  @IsString({ message: 'El ID de la persona natural debe ser un texto válido' })
  naturalPersonId: string;

  @IsNotEmpty({ message: 'El dominio y/ tenantId es requerido' })
  @IsString({ message: 'El dominio y/o tenantId debe ser un texto válido' })
  @Length(1, 35, {
    message: 'El dominio debe tener entre 1 y 15 caracteres',
  })
  domain: string;

  @IsEnum(CodeService, { message: 'El campo service debe ser: VDI, STO, SUP' })
  @IsNotEmpty({ message: 'El campo service no puede estar vacío.' })
  service: CodeService;

  @IsOptional()
  @IsString({ message: 'El rol debe ser un string' })
  @Length(1, 35, {
    message: 'El rol debe tener entre 1 y 35 caracteres',
  })
  role?: string;
}

export class CreateSubscriberResponseDto {
  subscriberId: string;
  username: string;
}
