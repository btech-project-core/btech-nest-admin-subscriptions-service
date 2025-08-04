import { ModalitySubscription } from '../enums/modality-subscription.enum';
import { StatusSubscription } from '../enums/status-subscription.enum';
import {
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubscriptionsBussineDto } from '../../subscriptions-bussines/dto/create-subscriptions-bussine.dto';

export class CreateSubscriptionDto {
  @IsNotEmpty({
    message: 'El id de la empresa es requerida',
  })
  @IsString({
    message: 'El id de la empresa debe ser un string',
  })
  personId: string;

  @IsDateString(
    {},
    {
      message: 'La fecha inicial debe ser una fecha válida en formato ISO',
    },
  )
  @IsNotEmpty({
    message: 'La fecha inicial es requerida',
  })
  initialDate: string;

  @IsDateString(
    {},
    {
      message: 'La fecha final debe ser una fecha válida en formato ISO',
    },
  )
  @IsNotEmpty({
    message: 'La fecha final es requerida',
  })
  finalDate: string;

  @IsDateString(
    {},
    {
      message:
        'La fecha de firma del contrato debe ser una fecha válida en formato ISO',
    },
  )
  @IsNotEmpty({
    message: 'La fecha de firma del contrato es requerida',
  })
  contractSigningDate: string;

  @IsNotEmpty({
    message: 'El modalidad de subscripción es requerida',
  })
  @IsEnum(ModalitySubscription, {
    message:
      'El modalidad de subscripción debe ser un valor válido: CORPORATIVO, EMPRESA o PERSONAL',
  })
  modality: ModalitySubscription;

  @IsOptional()
  @IsEnum(StatusSubscription, {
    message: 'El estado debe ser un valor válido del enum StatusSubscription',
  })
  status?: StatusSubscription;

  @IsOptional()
  @ValidateNested({
    each: true,
    message:
      'Cada elemento del array debe ser un objeto válido de CreateSubscriptionsBussineDto',
  })
  @Type(() => CreateSubscriptionsBussineDto)
  createSubscriptionsBussineDto?: CreateSubscriptionsBussineDto[];
}
