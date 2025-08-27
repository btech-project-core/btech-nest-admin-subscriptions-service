import { Type } from 'class-transformer';
import { IsArray, IsUUID } from 'class-validator';
import { NaturalPersonResponseDto } from './natural-person.dto';

export class FindMultipleNaturalPersonsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @Type(() => String)
  naturalPersonIds: string[];
}

export class FindMultipleNaturalPersonsResponseDto extends NaturalPersonResponseDto {}
