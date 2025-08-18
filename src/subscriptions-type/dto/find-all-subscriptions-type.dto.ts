import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllSubscriptionsTypeDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  term?: string;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'La paginación debe ser un valor booleano' })
  hasPagination?: boolean;
}

export class FindAllSubscriptionsTypeResponseDto {
  subscriptionTypeId: string;
  description: string;
  isActive: boolean;
}
