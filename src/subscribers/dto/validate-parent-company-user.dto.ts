import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateParentCompanyUserDto {
  @IsNotEmpty({ message: 'El subscriptionBussineId es requerido' })
  @IsString({ message: 'El subscriptionBussineId debe ser un texto válido' })
  subscriptionBussineId: string;
}

export class ValidateParentCompanyUserResponseDto {
  isParentCompanyUser: boolean;
}
