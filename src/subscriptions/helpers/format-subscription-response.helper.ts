import { FindSubscriptionMultiplePersonDataResponseDto } from 'src/common/dto/find-subscription-multiple-person-data.dto';
import { FindAllSubscriptionResponseDto } from '../dto/find-all-subscription.dto';
import { Subscription } from '../entities/subscription.entity';

export const formatSubscriptionResponse = (
  subscription: Subscription,
  person: FindSubscriptionMultiplePersonDataResponseDto | undefined,
  term?: string,
): FindAllSubscriptionResponseDto | null => {
  const response: FindAllSubscriptionResponseDto = {
    subscriptionId: subscription.subscriptionId,
    personId: subscription.personId,
    documentNumber: person?.documentNumber || '',
    fullName: person?.fullName || '',
    initialDate: subscription.initialDate,
    finalDate: subscription.finalDate,
    contractSigningDate: subscription.contractSigningDate,
    status: subscription.status,
  };

  if (term) {
    const searchFields = [
      response.documentNumber,
      response.fullName,
      response.initialDate?.toString(),
      response.finalDate?.toString(),
      response.contractSigningDate?.toString(),
    ]
      .join(' ')
      .toLowerCase();
    if (!searchFields.includes(term.toLowerCase())) {
      return null;
    }
  }

  return response;
};
