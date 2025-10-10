import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionDetailDesigneModeService } from './services/subscription-detail-designe-mode.service';
import { CreateSubscriptionDetailDesigneModeDto } from './dto/create-subscription-detail-designe-mode.dto';
import { SubscriptionDetailDesigneMode } from './entities/subscription-detail-designe-mode.entity';
import {
  FindByDomainDto,
  FindByDomainResponseDto,
} from './dto/find-by-domain.dto';

@Controller()
export class SubscriptionDetailDesigneModeController {
  constructor(
    private readonly subscriptionDetailDesigneModeService: SubscriptionDetailDesigneModeService,
  ) {}

  @MessagePattern('subscription-detail-designe-mode.create')
  async create(
    @Payload() createDto: CreateSubscriptionDetailDesigneModeDto,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriptionDetailDesigneModeService.create(createDto);
  }

  @MessagePattern('subscription-detail-designe-mode.findAll')
  async findAll(): Promise<SubscriptionDetailDesigneMode[]> {
    return await this.subscriptionDetailDesigneModeService.findAll();
  }

  @MessagePattern('subscription-detail-designe-mode.findOne')
  async findOne(
    @Payload('id') id: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriptionDetailDesigneModeService.findOne(id);
  }

  @MessagePattern('subscription-detail-designe-mode.delete')
  async delete(@Payload('id') id: string): Promise<{ message: string }> {
    return await this.subscriptionDetailDesigneModeService.delete(id);
  }

  @GrpcMethod('SubscribersService', 'FindByDomainOrSubscriptionDetailId')
  async findByDomain(data: FindByDomainDto): Promise<FindByDomainResponseDto> {
    return await this.subscriptionDetailDesigneModeService.findByDomain(
      data.domain,
      data.modeCode,
    );
  }
}
