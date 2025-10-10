import { Injectable } from '@nestjs/common';
import { SubscriptionDetailDesigneModeCoreService } from './subscription-detail-designe-mode-core.service';
import { SubscriptionDetailDesigneModeValidateService } from './subscription-detail-designe-mode-validate.service';
import { SubscriptionDetailDesigneModeCustomService } from './subscription-detail-designe-mode-custom.service';
import { CreateSubscriptionDetailDesigneModeDto } from '../dto/create-subscription-detail-designe-mode.dto';
import { SubscriptionDetailDesigneMode } from '../entities/subscription-detail-designe-mode.entity';
import { FindByDomainResponseDto } from '../dto/find-by-domain.dto';

@Injectable()
export class SubscriptionDetailDesigneModeService {
  constructor(
    private readonly coreService: SubscriptionDetailDesigneModeCoreService,
    private readonly validateService: SubscriptionDetailDesigneModeValidateService,
    private readonly customService: SubscriptionDetailDesigneModeCustomService,
  ) {}

  async create(
    createDto: CreateSubscriptionDetailDesigneModeDto,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.coreService.create(createDto);
  }

  async findAll(): Promise<SubscriptionDetailDesigneMode[]> {
    return await this.coreService.findAll();
  }

  async findOne(
    subscriptionDetailDesigneModeId: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.coreService.findOne(subscriptionDetailDesigneModeId);
  }

  async delete(
    subscriptionDetailDesigneModeId: string,
  ): Promise<{ message: string }> {
    return await this.coreService.delete(subscriptionDetailDesigneModeId);
  }

  async validateOnlyOnePrimary(subscriptionDetailId: string): Promise<boolean> {
    return await this.validateService.validateOnlyOnePrimary(
      subscriptionDetailId,
    );
  }

  async validateUniqueModeCombination(
    subscriptionDetailId: string,
    designerModeId: string,
  ): Promise<boolean> {
    return await this.validateService.validateUniqueModeCombination(
      subscriptionDetailId,
      designerModeId,
    );
  }

  async findByDomain(
    domain: string,
    modeCode?: string,
  ): Promise<FindByDomainResponseDto> {
    return await this.customService.findByDomain(domain, modeCode);
  }
}
