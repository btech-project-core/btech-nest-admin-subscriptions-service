import { FindAllSubscriptionFeaturesResponseDto } from '../dto/find-all-subscription-features.dto';
import { SubscriptionFeatures } from '../entities/subscription-features.entity';

export const formatSubscriptionFeaturesResponse = (
  subscriptionFeatures: SubscriptionFeatures,
): FindAllSubscriptionFeaturesResponseDto => ({
  subscriptionFeaturesId: subscriptionFeatures.subscriptionFeaturesId,
  code: subscriptionFeatures.code,
  description: subscriptionFeatures.description,
  isRequired: subscriptionFeatures.isRequired,
  isActive: subscriptionFeatures.isActive,
  subscriptionDetailId: subscriptionFeatures.subscriptionDetailId,
});
