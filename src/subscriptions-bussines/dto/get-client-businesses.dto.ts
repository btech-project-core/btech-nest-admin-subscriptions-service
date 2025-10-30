import { IsNotEmpty, IsString } from 'class-validator';

export class GetClientBusinessesDto {
  @IsNotEmpty()
  @IsString()
  subscriptionBussineId: string;
}
