import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRoleStatusDto {
  @IsNotEmpty({ message: 'El ID del rol es un campo obligatorio' })
  @IsUUID('all', {
    message: 'El ID del rol debe ser un UUID válido',
  })
  roleId: string;

  @IsNotEmpty({ message: 'El estado es un campo obligatorio' })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive: boolean;
}

export class UpdateRoleStatusResponseDto {
  message: string;
}
