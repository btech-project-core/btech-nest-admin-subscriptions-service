import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsServiceDto } from './create-subscriptions-service.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { FindAllSubscriptionsServiceResponseDto } from './find-all-subscription-service.dto';

export class UpdateSubscriptionsServiceDto extends PartialType(
  CreateSubscriptionsServiceDto,
) {
  @IsNotEmpty({
    message: 'El ID del servicio de suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message: 'El ID del servicio de suscripción debe ser una cadena de texto',
  })
  subscriptionsServiceId: string;
}

export class UpdateSubscriptionsServiceResponseDto extends FindAllSubscriptionsServiceResponseDto {}
