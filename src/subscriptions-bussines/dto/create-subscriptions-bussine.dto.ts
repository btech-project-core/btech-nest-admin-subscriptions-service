import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionsBussineDto {
  @IsNotEmpty({
    message: 'El id de la subscripción es requerido',
  })
  @IsString({
    message: 'El id de la subscripción debe ser un string',
  })
  subscriptionId: string;

  @IsNotEmpty({
    message: 'El id de la empresa es requerida',
  })
  @IsString({
    message: 'El id de la empresa debe ser un string',
  })
  personId: string;
}
