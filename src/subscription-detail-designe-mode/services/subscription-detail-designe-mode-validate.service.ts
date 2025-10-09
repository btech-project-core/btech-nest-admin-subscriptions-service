/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from '../entities/subscription-detail-designe-mode.entity';

@Injectable()
export class SubscriptionDetailDesigneModeValidateService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  /**
   * Valida que solo exista UN registro con isPrimary = true por subscriptionDetailId
   */
  async validateOnlyOnePrimary(subscriptionDetailId: string): Promise<boolean> {
    const primaryCount =
      await this.subscriptionDetailDesigneModeRepository.count({
        where: {
          subscriptionDetail: { subscriptionDetailId },
          isPrimary: true,
        },
      });
    if (primaryCount > 1)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Solo puede existir un modo principal por subscriptionDetail.`,
      });
    return true;
  }

  /**
   * Valida que no se repita la combinación subscriptionDetail + designerMode
   */
  async validateUniqueModeCombination(
    subscriptionDetailId: string,
    designerModeId: string,
  ): Promise<boolean> {
    const existing = await this.subscriptionDetailDesigneModeRepository.findOne(
      {
        where: {
          subscriptionDetail: { subscriptionDetailId },
          designerMode: { designerModeId },
        },
      },
    );
    if (existing)
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Ya existe un registro con este subscriptionDetail y designerMode.`,
      });
    return true;
  }

  /**
   * Valida que si existe "PREDETERMINADO POR EL SISTEMA", también existan CLARO y OSCURO
   */
  async validateSystemDefaultRequirements(
    subscriptionDetailId: string,
    designerModeCode: string,
  ): Promise<boolean> {
    // Solo aplica si el modo es "SISTEMA" o similar
    if (
      designerModeCode.toUpperCase().includes('SISTEMA') ||
      designerModeCode.toUpperCase().includes('SYSTEM')
    ) {
      const modes = await this.subscriptionDetailDesigneModeRepository
        .createQueryBuilder('sdm')
        .innerJoin('sdm.designerMode', 'dm')
        .where('sdm.subscriptionDetail = :subscriptionDetailId', {
          subscriptionDetailId,
        })
        .select('dm.code', 'code')
        .getRawMany();
      const codes = modes.map((m) => m.code.oUpperCase() as string);
      const hasLight = codes.some(
        (c) => c.includes('CLAR') || c.includes('LIGHT'),
      );
      const hasDark = codes.some(
        (c) => c.includes('OSCU') || c.includes('DARK'),
      );
      if (!hasLight || !hasDark)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `Para tener el modo PREDETERMINADO POR EL SISTEMA, debe existir al menos un modo CLARO y OSCURO.`,
        });
    }
    return true;
  }
}
