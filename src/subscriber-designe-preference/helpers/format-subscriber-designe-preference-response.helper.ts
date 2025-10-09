import { SubscriberDesignePreference } from '../entities/subscriber-designe-preference.entity';
import { CreateOrUpdateSubscriberDesignePreferenceResponseDto } from '../dto/create-or-update-subscriber-designe-preference.dto';

export const formatSubscriberDesignePreferenceResponse = (
  subscriberDesignePreference: SubscriberDesignePreference,
): CreateOrUpdateSubscriberDesignePreferenceResponseDto => {
  return {
    subscriberDesignePreferenceId:
      subscriberDesignePreference.subscriberDesignePreferenceId,
    subscriberId: subscriberDesignePreference.subscriber.subscriberId,
    subscriptionDetailDesigneModeId:
      subscriberDesignePreference.subscriptionDetailDesigneMode
        .subscriptionDetailDesigneModeId,
    designCode:
      subscriberDesignePreference.subscriptionDetailDesigneMode.designerMode
        .code,
  };
};
