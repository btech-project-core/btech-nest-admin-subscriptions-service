import { FindAllDesigneModeResponseDto } from '../dto/find-all-designe-mode.dto';
import { DesignerMode } from '../entities/designe-mode.entity';

export const formatDesigneModeResponse = (
  designerMode: DesignerMode,
): FindAllDesigneModeResponseDto => ({
  designerModeId: designerMode.designerModeId,
  description: designerMode.description,
  code: designerMode.code,
  isActive: designerMode.isActive,
});
