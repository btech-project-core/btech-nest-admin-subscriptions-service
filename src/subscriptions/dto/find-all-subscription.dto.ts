import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StatusSubscription } from '../enums/status-subscription.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindAllSubscriptionDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda es una cadena de texto' })
  term?: string;

  @IsOptional()
  @IsEnum(StatusSubscription, {
    message:
      'El estado debe ser un valor válido del enum: PENDIENTE, VIGENTE, CULMINADO, CANCELADO',
  })
  status?: StatusSubscription;
}

export class FindAllSubscriptionResponseDto {
  subscriptionId: string;
  personId: string;
  documentNumber: string;
  fullName: string;
  initialDate: Date;
  finalDate: Date;
  contractSigningDate: Date;
  status: StatusSubscription;
}
