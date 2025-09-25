import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { ModalitySubscription } from '../enums/modality-subscription.enum';

export const extractAllPersonIds = (
  createSubscriptionDto: CreateSubscriptionDto,
): string[] => {
  const { modality, personId, subscriptionsBusiness } = createSubscriptionDto;
  const personIds: string[] = [personId];

  if (modality === ModalitySubscription.CORPORATE) {
    subscriptionsBusiness.forEach((business) => {
      if (business.personId) {
        personIds.push(business.personId);
      }
    });
  }

  return [...new Set(personIds.filter(Boolean))];
};
