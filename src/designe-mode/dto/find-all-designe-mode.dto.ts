import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllDesigneModeDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  term?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'La paginación debe ser un valor booleano' })
  hasPagination?: boolean;

  @IsOptional()
  @IsString({
    message: 'El ID del detalle de suscripción debe ser un texto válido',
  })
  subscriptionDetailId?: string;
}

export class FindAllDesigneModeResponseDto {
  designerModeId: string;
  description: string;
  code: string;
  isActive: boolean;
  subscriptionDetailId: string;
}
