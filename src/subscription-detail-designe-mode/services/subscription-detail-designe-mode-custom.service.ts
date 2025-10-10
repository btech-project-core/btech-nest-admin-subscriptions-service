import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from '../entities/subscription-detail-designe-mode.entity';
import { FindByDomainResponseDto } from '../dto/find-by-domain.dto';
import { formatFindByDomainResponse } from '../helpers/format-find-by-domain-response.helper';

enum CodeFeatures {
  DOM = 'DOM',
}

@Injectable()
export class SubscriptionDetailDesigneModeCustomService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async findByDomain(
    domain: string,
    modeCode?: string,
  ): Promise<FindByDomainResponseDto> {
    const queryBuilder = this.subscriptionDetailDesigneModeRepository
      .createQueryBuilder('sddm')
      .leftJoinAndSelect('sddm.designerMode', 'designerMode')
      .leftJoinAndSelect('sddm.subscriptionDetail', 'subscriptionDetail')
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .leftJoinAndSelect(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .leftJoinAndSelect(
        'sddm.subscriptionsDesigneSetting',
        'subscriptionsDesigneSetting',
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('subscriptionDetail.subscriptionDetailId = :domain', {
            domain,
          }).orWhere(
            'subscriptionFeatures.code = :featureCode AND subscriptionDetailFeatures.value = :domainValue',
            {
              featureCode: CodeFeatures.DOM,
              domainValue: domain,
            },
          );
        }),
      );
    if (modeCode)
      queryBuilder.andWhere('designerMode.code = :modeCode', {
        modeCode,
      });
    const results = await queryBuilder.getMany();
    // Deduplicar por ID manualmente
    const uniqueResults = Array.from(
      new Map(
        results.map((item) => [item.subscriptionDetailDesigneModeId, item]),
      ).values(),
    );
    if (!uniqueResults || uniqueResults.length === 0)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró la configuración para: ${domain}`,
      });
    const configurations = uniqueResults.map((item) =>
      formatFindByDomainResponse(item),
    );

    return { configurations };
  }
}
