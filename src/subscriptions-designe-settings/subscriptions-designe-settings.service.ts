import { HttpStatus, Injectable } from '@nestjs/common';
import { SubscriptionsDesigneSetting } from './entities/subscriptions-designe-setting.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeFeatures } from 'src/common/enums/code-features.enum';
import { RpcException } from '@nestjs/microservices';
import { FindByDomainOrSubscriptionDetailIdResponseDto } from './dto/find-by-domain-or-subscription-detail-id.dto';
import { formatFindByDomainOrSubscriptionDetailIdResponse } from './helpers/format-find-by-domain-or-subscription-detail-id-response.helper';

@Injectable()
export class SubscriptionsDesigneSettingsService {
  constructor(
    @InjectRepository(SubscriptionsDesigneSetting)
    private readonly subscriptionsDesigneSettingRepository: Repository<SubscriptionsDesigneSetting>,
  ) {}
  async findByDomainOrSubscriptionDetailId(
    domain: string,
  ): Promise<FindByDomainOrSubscriptionDetailIdResponseDto> {
    const queryBuilder = this.subscriptionsDesigneSettingRepository
      .createQueryBuilder('subscriptionsDesigneSetting')
      .leftJoinAndSelect(
        'subscriptionsDesigneSetting.designerMode',
        'designerMode',
      )
      .leftJoinAndSelect(
        'subscriptionsDesigneSetting.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .leftJoinAndSelect(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      );
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('subscriptionDetail.subscriptionDetailId = :domain', {
          domain,
        }).orWhere(
          'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
          {
            code: CodeFeatures.DOM,
            domain: domain,
          },
        );
      }),
    );
    const subscriptionsDesigneSetting = await queryBuilder.getMany();
    if (
      !subscriptionsDesigneSetting ||
      subscriptionsDesigneSetting.length === 0
    )
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró la configuración de diseño para el identificador: ${domain}`,
      });
    return {
      configurations: subscriptionsDesigneSetting.map(
        formatFindByDomainOrSubscriptionDetailIdResponse,
      ),
    };
  }
}
