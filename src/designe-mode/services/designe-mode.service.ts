import { Injectable } from '@nestjs/common';
import { DesignerMode } from '../entities/designe-mode.entity';
import {
  CreateDesigneModeDto,
  CreateDesigneModeResponseDto,
} from '../dto/create-designe-mode.dto';
import {
  UpdateDesigneModeDto,
  UpdateDesigneModeResponseDto,
} from '../dto/update-designe-mode.dto';
import {
  FindAllDesigneModeDto,
  FindAllDesigneModeResponseDto,
} from '../dto/find-all-designe-mode.dto';
import {
  UpdateDesigneModeStatusDto,
  UpdateDesigneModeStatusResponseDto,
} from '../dto/update-designe-mode-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { DesigneModeCoreService } from './designe-mode-core.service';
import { DesigneModeValidateService } from './designe-mode-validate.service';
import { DesigneModeCustomService } from './designe-mode-custom.service';

@Injectable()
export class DesigneModeService {
  constructor(
    private readonly designeModeCoreService: DesigneModeCoreService,
    private readonly designeModeValidateService: DesigneModeValidateService,
    private readonly designeModeCustomService: DesigneModeCustomService,
  ) {}

  async create(
    createDesigneModeDto: CreateDesigneModeDto,
  ): Promise<CreateDesigneModeResponseDto> {
    return await this.designeModeCoreService.create(createDesigneModeDto);
  }

  async findAll(
    findAllDesigneModeDto: FindAllDesigneModeDto,
  ): Promise<
    | FindAllDesigneModeResponseDto[]
    | PaginationResponseDto<FindAllDesigneModeResponseDto>
  > {
    return await this.designeModeCoreService.findAll(findAllDesigneModeDto);
  }

  async findOne(designerModeId: string): Promise<DesignerMode> {
    return await this.designeModeCoreService.findOne(designerModeId);
  }

  async update(
    updateDesigneModeDto: UpdateDesigneModeDto,
  ): Promise<UpdateDesigneModeResponseDto> {
    return await this.designeModeCoreService.update(updateDesigneModeDto);
  }

  async updateStatus(
    updateDesigneModeStatusDto: UpdateDesigneModeStatusDto,
  ): Promise<UpdateDesigneModeStatusResponseDto> {
    return await this.designeModeCoreService.updateStatus(
      updateDesigneModeStatusDto,
    );
  }
}
