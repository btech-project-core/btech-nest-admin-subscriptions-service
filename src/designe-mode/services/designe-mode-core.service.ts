import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
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
import { formatDesigneModeResponse } from '../helpers/format-designe-mode-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { DesigneModeCustomService } from './designe-mode-custom.service';

@Injectable()
export class DesigneModeCoreService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
    private readonly designeModeCustomService: DesigneModeCustomService,
  ) {}

  async create(
    createDesigneModeDto: CreateDesigneModeDto,
  ): Promise<CreateDesigneModeResponseDto> {
    const designerMode =
      this.designerModeRepository.create(createDesigneModeDto);
    await this.designerModeRepository.save(designerMode);
    return formatDesigneModeResponse(designerMode);
  }

  async findAll(
    findAllDesigneModeDto: FindAllDesigneModeDto,
  ): Promise<
    | FindAllDesigneModeResponseDto[]
    | PaginationResponseDto<FindAllDesigneModeResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllDesigneModeDto;
    const queryBuilder =
      this.designerModeRepository.createQueryBuilder('designerMode');

    if (term)
      queryBuilder.andWhere(
        '(designerMode.description LIKE :term OR designerMode.code LIKE :term)',
        { term: `%${term}%` },
      );
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('designerMode.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('designerMode.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatDesigneModeResponse(data),
        ),
      };
    }
    const designerModes = await queryBuilder.getMany();
    return designerModes.map(formatDesigneModeResponse);
  }

  async findOne(designerModeId: string): Promise<DesignerMode> {
    const designerMode = await this.designerModeRepository.findOne({
      where: { designerModeId: designerModeId.trim() },
    });
    if (!designerMode)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Modo de diseño con ID '${designerModeId}' no encontrado`,
      });
    return designerMode;
  }

  async update(
    updateDesigneModeDto: UpdateDesigneModeDto,
  ): Promise<UpdateDesigneModeResponseDto> {
    const { designerModeId, description, code } = updateDesigneModeDto;
    const designerMode = await this.findOne(designerModeId);

    designerMode.description = description ?? designerMode.description;
    designerMode.code = code ?? designerMode.code;

    await this.designerModeRepository.save(designerMode);
    return formatDesigneModeResponse(designerMode);
  }

  async updateStatus(
    updateDesigneModeStatusDto: UpdateDesigneModeStatusDto,
  ): Promise<UpdateDesigneModeStatusResponseDto> {
    const { designerModeId, isActive } = updateDesigneModeStatusDto;
    const existingDesignerMode = await this.findOne(designerModeId);
    if (!isActive)
      await this.designeModeCustomService.relatedDesigneSettings(
        designerModeId,
      );
    await this.designerModeRepository.update(designerModeId, {
      isActive,
    });
    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Modo de diseño '${existingDesignerMode.description}' ${statusMessage} exitosamente`,
    };
  }
}
