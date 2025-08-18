import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { FindAllRoleResponseDto } from './find-all-role.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty({ message: 'El ID del rol es un campo obligatorio' })
  @IsUUID('all', {
    message: 'El ID del rol debe ser un UUID válido',
  })
  roleId: string;
}

export class UpdateRoleResponseDto extends FindAllRoleResponseDto {}
