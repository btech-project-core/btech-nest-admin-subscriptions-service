import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllSubscriptionsServiceDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda es una cadena de texto' })
  term?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de la subscripción es un booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo hasPagination es un booleano' })
  hasPagination?: boolean;
}

export class FindAllSubscriptionsServiceResponseDto {
  subscriptionsServiceId: string;
  code: string;
  description: string;
  isActive: boolean;
}
