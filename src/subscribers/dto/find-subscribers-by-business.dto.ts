import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetSubscribersByBusinessDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  subscriptionBussineId: string;

  @IsOptional()
  @IsString()
  service?: string;
}

export class GetSubscribersByBusinessResponseDto {
  subscriberId: string;
  role: string[];
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  documentNumber: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
}
