import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionFeaturesDto } from './create-subscription-features.dto';
import { FindAllSubscriptionFeaturesResponseDto } from './find-all-subscription-features.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSubscriptionFeaturesDto extends PartialType(
  CreateSubscriptionFeaturesDto,
) {
  @IsNotEmpty({
    message:
      'El ID de la característica de la suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message:
      'El ID de la característica de la suscripción debe ser un UUID válido',
  })
  subscriptionFeaturesId: string;
}

export class UpdateSubscriptionFeaturesResponseDto extends FindAllSubscriptionFeaturesResponseDto {}
