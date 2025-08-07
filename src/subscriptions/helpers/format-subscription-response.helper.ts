import { FindSubscriptionMultiplePersonDataResponseDto } from '../../common/dto/find-subscription-multiple-person-data.dto';
import { FindAllSubscriptionResponseDto } from '../dto/find-all-subscription.dto';
import { Subscription } from '../entities/subscription.entity';

export const formatSubscriptionResponse = (
  subscription: Subscription,
  person: FindSubscriptionMultiplePersonDataResponseDto | undefined,
): FindAllSubscriptionResponseDto => {
  return {
    subscriptionId: subscription.subscriptionId,
    personId: subscription.personId,
    documentNumber: person?.documentNumber || '',
    fullName: person?.fullName || '',
    initialDate: subscription.initialDate,
    finalDate: subscription.finalDate,
    contractSigningDate: subscription.contractSigningDate,
    status: subscription.status,
  };
};
