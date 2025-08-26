import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubscriptionDetailDto } from 'src/subscriptions-detail/dto/create-subscription-detail.dto';

export class CreateSubscriptionsBussineDto {
  @IsOptional()
  @IsString({
    message: 'El id de la persona debe ser un string',
  })
  personId?: string;

  @IsArray({ message: 'Los detalles de suscripción deben ser un arreglo' })
  @ValidateNested({
    each: true,
    message:
      'Cada detalle debe ser un objeto válido de CreateSubscriptionDetailDto',
  })
  @Type(() => CreateSubscriptionDetailDto)
  subscriptionDetails: CreateSubscriptionDetailDto[];
}
