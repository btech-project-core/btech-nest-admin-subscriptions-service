import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DesigneModeService } from './services/designe-mode.service';
import {
  CreateDesigneModeDto,
  CreateDesigneModeResponseDto,
} from './dto/create-designe-mode.dto';
import {
  UpdateDesigneModeDto,
  UpdateDesigneModeResponseDto,
} from './dto/update-designe-mode.dto';
import {
  FindAllDesigneModeDto,
  FindAllDesigneModeResponseDto,
} from './dto/find-all-designe-mode.dto';
import {
  UpdateDesigneModeStatusDto,
  UpdateDesigneModeStatusResponseDto,
} from './dto/update-designe-mode-status.dto';
import { FindOneDesigneModeResponseDto } from './dto/find-one-designe-mode.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Controller()
export class DesigneModeController {
  constructor(private readonly designeModeService: DesigneModeService) {}

  @MessagePattern('designeMode.create')
  async create(
    @Payload() createDesigneModeDto: CreateDesigneModeDto,
  ): Promise<CreateDesigneModeResponseDto> {
    return await this.designeModeService.create(createDesigneModeDto);
  }

  @MessagePattern('designeMode.findAll')
  async findAll(
    @Payload() findAllDesigneModeDto: FindAllDesigneModeDto,
  ): Promise<
    | FindAllDesigneModeResponseDto[]
    | PaginationResponseDto<FindAllDesigneModeResponseDto>
  > {
    return await this.designeModeService.findAll(findAllDesigneModeDto);
  }

  @MessagePattern('designeMode.findOne')
  async findOne(
    @Payload('designerModeId', ParseUUIDPipe) designerModeId: string,
  ): Promise<FindOneDesigneModeResponseDto> {
    return await this.designeModeService.findOne(designerModeId);
  }

  @MessagePattern('designeMode.update')
  async update(
    @Payload() updateDesigneModeDto: UpdateDesigneModeDto,
  ): Promise<UpdateDesigneModeResponseDto> {
    return await this.designeModeService.update(updateDesigneModeDto);
  }

  @MessagePattern('designeMode.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateDesigneModeStatusDto,
  ): Promise<UpdateDesigneModeStatusResponseDto> {
    return await this.designeModeService.updateStatus(updateStatusDto);
  }
}
