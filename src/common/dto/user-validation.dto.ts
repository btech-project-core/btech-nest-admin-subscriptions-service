import { ExcelUserDto } from './excel-user.dto';

export class UserValidationRresponseDto {
  isValid: boolean;
  errorCount: number;
  validUsers?: ExcelUserDto[];
  errors?: string[];
}
