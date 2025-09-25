import { Injectable } from '@nestjs/common';
import { SubscribersSubscriptionDetailCoreService } from './subscribers-subscription-detail-core.service';
import { SubscribersSubscriptionDetailValidateService } from './subscribers-subscription-detail-validate.service';
import { SubscribersSubscriptionDetailCustomService } from './subscribers-subscription-detail-custom.service';

@Injectable()
export class SubscribersSubscriptionDetailService {
  constructor(
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly subscribersSubscriptionDetailValidateService: SubscribersSubscriptionDetailValidateService,
    private readonly subscribersSubscriptionDetailCustomService: SubscribersSubscriptionDetailCustomService,
  ) {}

  // Métodos del orquestador se implementarán según requerimientos del controller
}
