import { FindSubscriptionMultiplePersonDataResponseDto } from 'src/common/dto/find-subscription-multiple-person-data.dto';
import { FindAllSubscriptionResponseDto } from '../dto/find-all-subscription.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';

export const formatSubscriptionBussineResponse = (
  subscriptionBussine: SubscriptionsBussine,
  person: FindSubscriptionMultiplePersonDataResponseDto | undefined,
  term?: string,
): FindAllSubscriptionResponseDto | null => {
  if (!person) return null;

  const response: FindAllSubscriptionResponseDto = {
    subscriptionId: subscriptionBussine.subscription.subscriptionId,
    subscriptionBussineId: subscriptionBussine.subscriptionBussineId,
    personId: subscriptionBussine.personId,
    documentNumber: person.documentNumber,
    fullName: person.fullName,
    initialDate: subscriptionBussine.subscription.initialDate,
    finalDate: subscriptionBussine.subscription.finalDate,
    contractSigningDate: subscriptionBussine.subscription.contractSigningDate,
    status: subscriptionBussine.subscription.status,
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
