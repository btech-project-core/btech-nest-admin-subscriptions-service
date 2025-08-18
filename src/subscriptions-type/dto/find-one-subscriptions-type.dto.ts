import { IsNotEmpty, IsUUID } from 'class-validator';
import { FindAllSubscriptionsTypeResponseDto } from './find-all-subscriptions-type.dto';

export class FindOneSubscriptionsTypeDto {
  @IsNotEmpty({
    message: 'El ID del tipo de suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message: 'El ID del tipo de suscripción debe ser un UUID válido',
  })
  subscriptionTypeId: string;
}

export class FindOneSubscriptionsTypeResponseDto extends FindAllSubscriptionsTypeResponseDto {
  createdAt: Date;
  updatedAt: Date;
}
