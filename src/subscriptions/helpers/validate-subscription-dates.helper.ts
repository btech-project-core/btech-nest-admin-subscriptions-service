import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const validateSubscriptionDates = (
  initialDate: string,
  finalDate: string,
): void => {
  const startDate = new Date(initialDate);
  const endDate = new Date(finalDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDateOnly = new Date(startDate);
  startDateOnly.setHours(0, 0, 0, 0);
  // Validar que la fecha inicial sea mayor o igual a hoy
  if (startDateOnly < today)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'La fecha inicial debe ser mayor o igual a la fecha actual',
    });
  // Validar que la fecha inicial no sea después de la fecha final
  if (startDate > endDate)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'La fecha inicial no puede ser posterior a la fecha final',
    });
};
