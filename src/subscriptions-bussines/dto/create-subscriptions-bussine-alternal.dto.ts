import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { NaturalPersonForSubscriberDto } from '.';

export class CreateSubscriptionsBussineAlternalDto {
  @IsString({
    message: 'El id de la suscripción debe ser un string',
  })
  subscriptionId: string;

  @IsString({
    message: 'El id de la persona debe ser un string',
  })
  personId: string;

  @IsString({
    message: 'El id del servicio de la suscripción debe ser un string',
  })
  subscriptionServiceId: string;

  @IsOptional()
  @IsArray({ message: 'Las personas naturales deben ser un arreglo' })
  @ValidateNested({
    each: true,
    message: 'Cada persona natural debe ser un objeto válido',
  })
  @Type(() => NaturalPersonForSubscriberDto)
  naturalPersons?: NaturalPersonForSubscriberDto[];
}
