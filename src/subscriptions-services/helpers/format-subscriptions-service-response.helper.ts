import { CodeService } from 'src/common/enums/code-service.enum';
import { FindAllSubscriptionsServiceResponseDto } from '../dto/find-all-subscription-service.dto';
import { SubscriptionsService } from '../entities/subscriptions-service.entity';

export const formatSubscriptionsServiceResponse = (
  subscriptionsService: SubscriptionsService,
): FindAllSubscriptionsServiceResponseDto => {
  return {
    subscriptionsServiceId: subscriptionsService.subscriptionsServiceId,
    code: subscriptionsService.code as CodeService,
    description: subscriptionsService.description,
    isActive: subscriptionsService.isActive,
  };
};
