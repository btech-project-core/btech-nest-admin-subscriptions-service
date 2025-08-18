import { FindAllRoleResponseDto } from '../dto/find-all-role.dto';
import { Role } from '../entities/role.entity';

export const formatRoleResponse = (
  role: Role,
): FindAllRoleResponseDto => ({
  roleId: role.roleId,
  code: role.code,
  description: role.description,
  isActive: role.isActive,
});