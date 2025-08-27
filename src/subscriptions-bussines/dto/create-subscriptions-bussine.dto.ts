import {
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubscriptionDetailDto } from 'src/subscriptions-detail/dto/create-subscription-detail.dto';

export class NaturalPersonForSubscriberDto {
  @IsUUID('4', { message: 'El naturalPersonId debe ser un UUID válido' })
  naturalPersonId: string;

  @IsString({ message: 'El documentNumber debe ser un string' })
  documentNumber: string;
}

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

  @IsOptional()
  @IsArray({ message: 'Las personas naturales deben ser un arreglo' })
  @ValidateNested({
    each: true,
    message: 'Cada persona natural debe ser un objeto válido',
  })
  @Type(() => NaturalPersonForSubscriberDto)
  naturalPersons?: NaturalPersonForSubscriberDto[];
}
