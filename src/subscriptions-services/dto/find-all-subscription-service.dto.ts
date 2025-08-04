import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CodeService } from 'src/common/enums/code-service.enum';

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
  code: CodeService;
  description: string;
  isActive: boolean;
}
