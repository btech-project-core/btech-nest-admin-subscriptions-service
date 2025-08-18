import { SubscriptionsType } from '../entities/subscriptions-type.entity';
import { FindAllSubscriptionsTypeResponseDto } from '../dto/find-all-subscriptions-type.dto';

export const formatSubscriptionsTypeResponse = (
  subscriptionsType: SubscriptionsType,
): FindAllSubscriptionsTypeResponseDto => ({
  subscriptionTypeId: subscriptionsType.subscriptionTypeId,
  description: subscriptionsType.description,
  isActive: subscriptionsType.isActive,
});