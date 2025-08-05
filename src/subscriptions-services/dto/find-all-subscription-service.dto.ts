import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindAllSubscriptionsServiceDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda es una cadena de texto' })
  term?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de la subscripción es un booleano' })
  isActive?: boolean;
}

export class FindAllSubscriptionsServiceResponseDto {
  subscriptionsServiceId: string;
  code: string;
  description: string;
  isActive: boolean;
}
