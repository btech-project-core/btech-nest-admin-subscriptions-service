import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const validateSubscriptionDates = (
  initialDate: string,
  finalDate: string,
  contractSigningDate: string,
): void => {
  const startDate = new Date(initialDate);
  const endDate = new Date(finalDate);
  const contractDate = new Date(contractSigningDate);
  const today = new Date();
  // Normalizar fechas para comparación solo por día (sin horas)
  today.setHours(0, 0, 0, 0);
  const startDateOnly = new Date(startDate);
  startDateOnly.setHours(0, 0, 0, 0);
  const contractDateOnly = new Date(contractDate);
  contractDateOnly.setHours(0, 0, 0, 0);
  // 1. Validar que la fecha inicial sea mayor o igual a hoy
  if (startDateOnly < today)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'La fecha inicial debe ser mayor o igual a la fecha actual',
    });
  // 2. Validar que la fecha inicial no sea después de la fecha final
  if (startDate > endDate)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'La fecha inicial no puede ser posterior a la fecha final',
    });
  // 3. Validar que la fecha final no haya pasado ya
  const endDateOnly = new Date(endDate);
  endDateOnly.setHours(0, 0, 0, 0);
  if (endDateOnly < today)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'La fecha final no puede ser anterior a la fecha actual',
    });
  // 4. Validar que la fecha de firma del contrato no sea posterior a la fecha inicial
  if (contractDate > startDate)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message:
        'La fecha de firma del contrato no puede ser posterior a la fecha inicial de la suscripción',
    });
  // 5. Validar que la fecha de firma no sea muy antigua (máximo 1 año atrás)
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  if (contractDateOnly < oneYearAgo)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message:
        'La fecha de firma del contrato no puede ser anterior a un año desde hoy',
    });
  // 6. Validar duración mínima de suscripción (al menos 1 mes)
  const oneMonthAfterStart = new Date(startDate);
  oneMonthAfterStart.setMonth(startDate.getMonth() + 1);
  if (endDate < oneMonthAfterStart)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'La suscripción debe tener una duración mínima de 1 mes',
    });
};
