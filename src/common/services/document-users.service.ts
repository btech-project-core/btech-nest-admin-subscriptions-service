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
  async validateUserDocument(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    if (!file)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Archivo no proporcionado',
      });

    // Detectar tipo de archivo por extensión o MIME type
    const isExcel = this.isExcelFile(file);
    const isCsv = this.isCsvFile(file);

    if (!isExcel && !isCsv) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'Formato de archivo no soportado. Use Excel (.xlsx, .xls) o CSV (.csv)',
      });
    }

    if (isExcel) {
      return this.validateUserExcel(file);
    } else {
      return this.validateUserCsv(file);
    }
  }

  private isExcelFile(file: Express.Multer.File): boolean {
    const excelMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    const excelExtensions = ['.xlsx', '.xls'];

    return (
      excelMimeTypes.includes(file.mimetype) ||
      excelExtensions.some((ext) =>
        file.originalname?.toLowerCase().endsWith(ext),
      )
    );
  }

  private isCsvFile(file: Express.Multer.File): boolean {
    const csvMimeTypes = ['text/csv', 'application/csv', 'text/plain'];
    const csvExtensions = ['.csv'];

    return (
      csvMimeTypes.includes(file.mimetype) ||
      csvExtensions.some((ext) =>
        file.originalname?.toLowerCase().endsWith(ext),
      )
    );
  }

  async validateUserExcel(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer as any);
    const worksheet = workbook.worksheets[0];
    this.validateHeaders(worksheet);

    const { validRows, errors } = this.processRows(worksheet);
    return {
      isValid: errors.length === 0,
      errorCount: errors.length,
      ...(errors.length === 0 ? { validUsers: validRows } : { errors }),
    };
  }

  validateUserCsv(file: Express.Multer.File): UserValidationRresponseDto {
    const csvContent = file.buffer.toString('utf-8');
    const lines = csvContent.split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'El archivo CSV está vacío',
      });
    }

    // Validar encabezados
    const headers = this.parseCsvLine(lines[0]);
    this.validateCsvHeaders(headers);

    const { validRows, errors } = this.processCsvRows(lines);
    return {
      isValid: errors.length === 0,
      errorCount: errors.length,
      ...(errors.length === 0 ? { validUsers: validRows } : { errors }),
    };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ';' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());
    return result;
  }

  private validateCsvHeaders(headers: string[]): void {
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

    const missingHeaders = expectedHeaders.filter(
      (header) =>
        !headers.some(
          (actual) => actual?.toString().trim().toUpperCase() === header,
        ),
    );

    if (missingHeaders.length > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Encabezados faltantes en CSV: ${missingHeaders.join(', ')}`,
      });
  }

  private processCsvRows(lines: string[]): {
    validRows: ExcelUserDto[];
    errors: string[];
  } {
    const validRows: ExcelUserDto[] = [];
    const allRows: ExcelUserDto[] = [];
    const errors: string[] = [];

    // Saltar la primera línea (encabezados)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Saltar líneas vacías

      const rowNumber = i + 1;
      try {
        const fields = this.parseCsvLine(line);
        const rowData = this.extractCsvRowData(fields);
        allRows.push(rowData);

        const rowErrors = this.validateRowData(rowData, rowNumber);
        if (rowErrors.length === 0) {
          validRows.push(rowData);
        } else {
          errors.push(...rowErrors);
        }
      } catch (error) {
        errors.push(
          `Fila ${rowNumber}: Error al procesar la línea - ${error.message}`,
        );
      }
    }

    // Validar duplicados en TODAS las filas
    if (allRows.length > 0) {
      errors.push(...this.validateDuplicates(allRows));
    }

    return { validRows, errors };
  }

  private extractCsvRowData(fields: string[]): ExcelUserDto {
    return {
      documentNumber: (fields[0] || '').trim(),
      paternalSurname: (fields[1] || '').trim(),
      maternalSurname: (fields[2] || '').trim(),
      name: (fields[3] || '').trim(),
      email: (fields[4] || '').trim(),
      phone: (fields[5] || '').trim(),
      username: (fields[6] || '').trim(),
      role: this.parseRoleFromCsv(fields[7] || ''),
    };
  }

  private parseRoleFromCsv(roleValue: string): number {
    const trimmed = roleValue.trim();
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? NaN : parsed;
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
    const allRows: ExcelUserDto[] = [];
    const errors: string[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData = this.extractRowData(row);
      allRows.push(rowData);

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
