import { HttpStatus, Injectable } from '@nestjs/common';
import { SubscriptionsDesigneSetting } from './entities/subscriptions-designe-setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeFeatures } from 'src/common/enums/code-features.enum';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
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
      )
      .andWhere('subscriptionFeatures.code = :code', {
        code: CodeFeatures.DOM,
      })
      .andWhere('subscriptionDetailFeatures.value = :domain', { domain });
    const subscriptionsDesigneSetting = await queryBuilder.getMany();
    if (
      !subscriptionsDesigneSetting ||
      subscriptionsDesigneSetting.length === 0
    )
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: JSON.stringify({
          status: HttpStatus.NOT_FOUND,
          message: `No se encontró la configuración de diseño para el dominio: ${domain}`,
          service: 'admin-subscriptions-service',
        }),
      });
    return {
      configurations: subscriptionsDesigneSetting.map(
        formatFindByDomainOrSubscriptionDetailIdResponse,
      ),
    };
  }
}
