import { PartialType } from '@nestjs/mapped-types';
import { CreateDesigneModeDto } from './create-designe-mode.dto';
import { FindAllDesigneModeResponseDto } from './find-all-designe-mode.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateDesigneModeDto extends PartialType(CreateDesigneModeDto) {
  @IsNotEmpty({ message: 'El ID del modo de diseño es un campo obligatorio' })
  @IsUUID('all', {
    message: 'El ID del modo de diseño debe ser un UUID válido',
  })
  designerModeId: string;
}

export class UpdateDesigneModeResponseDto extends FindAllDesigneModeResponseDto {}
