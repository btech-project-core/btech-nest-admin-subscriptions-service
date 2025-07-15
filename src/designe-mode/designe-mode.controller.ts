import { Controller } from '@nestjs/common';
import { DesigneModeService } from './designe-mode.service';

@Controller()
export class DesigneModeController {
  constructor(private readonly designeModeService: DesigneModeService) {}
}
