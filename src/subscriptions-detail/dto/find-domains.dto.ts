import { IsEnum, IsOptional } from 'class-validator';
import { CodeService } from 'src/common/enums/code-service.enum';

export class FindDomainsDto {
  @IsOptional()
  @IsEnum(CodeService, {
    message: 'El campo service debe ser un código válido: VDI, STO, SUP',
  })
  service?: CodeService;
}

export class FindDomainsResponseDto {
  domains: string[];
}
