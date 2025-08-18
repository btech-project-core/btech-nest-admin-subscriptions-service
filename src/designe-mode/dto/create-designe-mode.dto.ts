import { IsNotEmpty, IsString, Length } from 'class-validator';
import { FindAllDesigneModeResponseDto } from './find-all-designe-mode.dto';

export class CreateDesigneModeDto {
  @IsNotEmpty({
    message: 'La descripción del modo de diseño es un campo obligatorio',
  })
  @IsString({
    message: 'La descripción del modo de diseño no puede estar vacía',
  })
  @Length(1, 65, {
    message: 'La descripción del modo de diseño no puede exceder 65 caracteres',
  })
  description: string;

  @IsNotEmpty({
    message: 'El código del modo de diseño es un campo obligatorio',
  })
  @IsString({
    message: 'El código del modo de diseño debe ser un texto válido',
  })
  @Length(1, 8, {
    message: 'El código del modo de diseño no puede exceder 8 caracteres',
  })
  code: string;
}

export class CreateDesigneModeResponseDto extends FindAllDesigneModeResponseDto {}
