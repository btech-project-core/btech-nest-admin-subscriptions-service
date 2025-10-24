import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { FindAllRoleResponseDto } from './find-all-role.dto';
import { RoleLevel } from '../enums/role-level.enum';

export class CreateRoleDto {
  @IsNotEmpty({
    message: 'El código del rol es un campo obligatorio',
  })
  @IsString({
    message: 'El código del rol debe ser un texto válido',
  })
  @Length(1, 8, {
    message: 'El código del rol no puede exceder 8 caracteres',
  })
  code: string;

  @IsNotEmpty({
    message: 'La descripción del rol es un campo obligatorio',
  })
  @IsString({
    message: 'La descripción del rol no puede estar vacía',
  })
  @Length(1, 25, {
    message: 'La descripción del rol no puede exceder 25 caracteres',
  })
  description: string;

  @IsNotEmpty({
    message: 'El nivel del rol es un campo obligatorio',
  })
  @IsEnum(RoleLevel, {
    message: 'El nivel del rol debe ser SERVICE o TENANT',
  })
  roleLevel: RoleLevel;

  @IsOptional()
  @IsString({
    message: 'El ID del negocio de suscripción debe ser un texto válido',
  })
  subscriptionBussineId?: string;
}

export class CreateRoleResponseDto extends FindAllRoleResponseDto {}
