import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ValidateParentCompanyUserDto {
  @IsNotEmpty({ message: 'El personId es requerido' })
  @IsString({ message: 'El personId debe ser un texto válido' })
  @IsUUID('4', { message: 'El personId debe ser un UUID válido' })
  personId: string;

  @IsNotEmpty({ message: 'El subscriptionBussineId es requerido' })
  @IsString({ message: 'El subscriptionBussineId debe ser un texto válido' })
  @IsUUID('4', { message: 'El subscriptionBussineId debe ser un UUID válido' })
  subscriptionBussineId: string;
}

export class ValidateParentCompanyUserResponseDto {
  isParentCompanyUser: boolean;
}
