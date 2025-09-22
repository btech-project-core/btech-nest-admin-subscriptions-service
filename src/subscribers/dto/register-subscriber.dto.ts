import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterSubscriberDto {
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
}

export class RegisterSubscriberResponseDto {
  subscriberId: string;
  username: string;
}
