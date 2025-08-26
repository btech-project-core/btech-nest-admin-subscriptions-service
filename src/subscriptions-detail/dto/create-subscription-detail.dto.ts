import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDetailDto {
  @IsNotEmpty({
    message: 'El ID del servicio es requerido',
  })
  @IsString({
    message: 'El ID del servicio debe ser un string',
  })
  subscriptionServiceId: string;

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
}
