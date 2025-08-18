import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSubscriptionsTypeDto } from './create-subscriptions-type.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSubscriptionsTypeDto extends PartialType(
  CreateSubscriptionsTypeDto,
) {
  @IsNotEmpty({
    message: 'El ID del tipo de suscripción es un campo obligatorio',
  })
  @IsString({
    message: 'El ID del tipo de suscripción debe ser un texto válido',
  })
  subscriptionTypeId: string;
}

export class UpdateSubscriptionsTypeResponseDto {
  subscriptionTypeId: string;
  description: string;
  isActive: boolean;
}
