import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RoleLevel } from '../enums/role-level.enum';

export class FindAllRoleDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  term?: string;

  @IsOptional()
  @IsEnum(RoleLevel, {
    message: 'El nivel del rol debe ser SERVICE o TENANT',
  })
  roleLevel?: RoleLevel;

  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'La paginación debe ser un valor booleano' })
  hasPagination?: boolean;

  @IsOptional()
  @IsString({
    message: 'El ID del negocio de suscripción debe ser un texto válido',
  })
  subscriptionBussineId?: string;
}

export class FindAllRoleResponseDto {
  roleId: string;
  code: string;
  description: string;
  roleLevel: RoleLevel;
  subscriptionBussineId: string;
  isActive: boolean;
}
