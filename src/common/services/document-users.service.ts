/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as ExcelJS from 'exceljs';
import { HttpStatus } from '@nestjs/common';
import { ExcelUserDto } from '../dto/excel-user.dto';
import { RpcException } from '@nestjs/microservices';
import {
  checkDuplicates,
  validateDocumentNumber,
  validateEmail,
  validatePhone,
  validateRole,
  validateUsername,
} from '../helpers/excel-validation.helper';
import { UserValidationRresponseDto } from '../dto/user-validation.dto';

export class DocumentUsersService {
  async validateUserExcel(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    if (!file)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Archivo no proporcionado',
      });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    this.validateHeaders(worksheet);

    const { validRows, errors } = this.processRows(worksheet);
    return {
      isValid: errors.length === 0,
      errorCount: errors.length,
      ...(errors.length === 0 ? { validUsers: validRows } : { errors }),
    };
  }

  private validateHeaders(worksheet: ExcelJS.Worksheet): void {
    const expectedHeaders = [
      'NUMERO DE IDENTIDAD',
      'PATERNO',
      'MATERNO',
      'NOMBRES',
      'CORREO',
      'TELEFONO',
      'NOMBRE DE USUARIO',
      'ROL',
    ];

    const actualHeaders = worksheet.getRow(1).values as string[];
    const missingHeaders = expectedHeaders.filter(
      (header) =>
        !actualHeaders.some((actual) => actual?.toString().trim() === header),
    );

    if (missingHeaders.length > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Encabezados faltantes: ${missingHeaders.join(', ')}`,
      });
  }

  private processRows(worksheet: ExcelJS.Worksheet): {
    validRows: ExcelUserDto[];
    errors: string[];
  } {
    const validRows: ExcelUserDto[] = [];
    const allRows: ExcelUserDto[] = []; // <- Nueva variable para todas las filas
    const errors: string[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData = this.extractRowData(row);
      allRows.push(rowData); // <- Agregar TODAS las filas aquí

      const rowErrors = this.validateRowData(rowData, rowNumber);
      if (rowErrors.length === 0) {
        validRows.push(rowData);
      } else {
        errors.push(...rowErrors);
      }
    });

    // Validar duplicados en TODAS las filas, no solo las válidas
    if (allRows.length > 0) {
      errors.push(...this.validateDuplicates(allRows));
    }

    return { validRows, errors };
  }

  private extractRowData(row: ExcelJS.Row): ExcelUserDto {
    return {
      documentNumber: this.getCellValue(row, 1),
      paternalSurname: this.getCellValue(row, 2),
      maternalSurname: this.getCellValue(row, 3),
      name: this.getCellValue(row, 4),
      email: this.getCellValue(row, 5),
      phone: this.getCellValue(row, 6),
      username: this.getCellValue(row, 7),
      role: this.getCellValueAsNumber(row, 8),
    };
  }

  private getCellValue(row: ExcelJS.Row, column: number): string {
    const value = row.getCell(column).value;

    if (value === null || value === undefined) return '';

    // Manejar hipervínculo (emails que Excel convierte automáticamente)
    if (typeof value === 'object' && value !== null) {
      if ('text' in value) return (value as any).text.toString().trim();
      if ('result' in value) return (value as any).result.toString().trim();
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString().trim();
    }

    return '';
  }

  private getCellValueAsNumber(row: ExcelJS.Row, column: number): number {
    const value = row.getCell(column).value;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || NaN;
    return NaN;
  }

  private validateRowData(data: ExcelUserDto, rowNumber: number): string[] {
    const errors: string[] = [];

    // Campos obligatorios
    const requiredFields = [
      { field: data.documentNumber, name: 'NUMERO DE IDENTIDAD' },
      { field: data.paternalSurname, name: 'PATERNO' },
      { field: data.maternalSurname, name: 'MATERNO' },
      { field: data.name, name: 'NOMBRES' },
      { field: data.email, name: 'CORREO' },
      { field: data.phone, name: 'TELEFONO' },
      { field: data.username, name: 'NOMBRE DE USUARIO' },
    ];

    requiredFields.forEach(({ field, name }) => {
      if (!field) errors.push(`Fila ${rowNumber}: ${name} es obligatorio`);
    });

    // Validaciones específicas
    if (data.documentNumber && !validateDocumentNumber(data.documentNumber))
      errors.push(`Fila ${rowNumber}: Número de identidad inválido`);

    if (data.email && !validateEmail(data.email))
      errors.push(`Fila ${rowNumber}: Email inválido`);

    if (data.phone && !validatePhone(data.phone))
      errors.push(`Fila ${rowNumber}: Teléfono inválido`);

    if (data.username && !validateUsername(data.username))
      errors.push(`Fila ${rowNumber}: Nombre de usuario inválido`);

    if (isNaN(data.role))
      errors.push(`Fila ${rowNumber}: Rol debe ser un número`);
    if (!validateRole(data.role))
      errors.push(`Fila ${rowNumber}: Rol debe ser 1 (ADMIN) o 2 (CLIENT)`);

    return errors;
  }

  private validateDuplicates(validRows: ExcelUserDto[]): string[] {
    const duplicateErrors: string[] = [];

    const documentDuplicates = checkDuplicates(
      validRows,
      (row) => row.documentNumber,
    );
    duplicateErrors.push(
      ...documentDuplicates.map((error) => `Documento ${error}`),
    );

    const emailDuplicates = checkDuplicates(validRows, (row) => row.email);
    duplicateErrors.push(...emailDuplicates.map((error) => `Email ${error}`));

    const phoneDuplicates = checkDuplicates(validRows, (row) => row.phone);
    duplicateErrors.push(
      ...phoneDuplicates.map((error) => `Teléfono ${error}`),
    );

    const usernameDuplicates = checkDuplicates(
      validRows,
      (row) => row.username,
    );
    duplicateErrors.push(
      ...usernameDuplicates.map((error) => `Usuario ${error}`),
    );

    return duplicateErrors;
  }
}
