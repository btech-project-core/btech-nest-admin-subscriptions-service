import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { NaturalPersonResponseDto } from './natural-person.dto';

export class FindMultipleNaturalPersonsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @Type(() => String)
  naturalPersonIds: string[];

  @IsOptional()
  @IsString()
  term?: string;
}

export class FindMultipleNaturalPersonsResponseDto extends NaturalPersonResponseDto {}
