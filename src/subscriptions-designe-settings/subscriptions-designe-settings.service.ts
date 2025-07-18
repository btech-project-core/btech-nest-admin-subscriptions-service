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
    domain?: string,
    subscriptionDetailId?: string,
  ): Promise<FindByDomainOrSubscriptionDetailIdResponseDto> {
    if (!domain && !subscriptionDetailId)
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        details: JSON.stringify({
          status: HttpStatus.BAD_REQUEST,
          message: 'Debe proporcionar al menos un parámetro',
          service: 'subscriptionsDesigneSettings',
        }),
      });
    const queryBuilder = this.subscriptionsDesigneSettingRepository
      .createQueryBuilder('subscriptionsDesigneSetting')
      .leftJoinAndSelect(
        'subscriptionsDesigneSetting.designerMode',
        'designerMode',
      )
      .leftJoinAndSelect(
        'subscriptionsDesigneSetting.subscriptionDetail',
        'subscriptionDetail',
      );
    if (domain)
      queryBuilder
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
    if (subscriptionDetailId)
      queryBuilder.andWhere(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId },
      );
    const subscriptionsDesigneSetting = await queryBuilder.getMany();
    return {
      configurations: subscriptionsDesigneSetting.map(
        formatFindByDomainOrSubscriptionDetailIdResponse,
      ),
    };
  }
}
