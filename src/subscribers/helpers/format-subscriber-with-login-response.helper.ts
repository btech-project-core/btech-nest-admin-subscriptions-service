import { NaturalPersonResponseDto } from 'src/common/dto/natural-person.dto';
import { Subscriber } from '../entities/subscriber.entity';
import { SubscriptionsDesigneSettingsResponseDto } from 'src/common/dto/subscriptions-designe-settings.dto';
import { PersonResponseDto } from 'src/common/dto/person.dto';

export const formatSubscriberWithLoginResponse = (
  subscriber: Subscriber,
  naturalPerson: NaturalPersonResponseDto,
  subscriptionPersonData: PersonResponseDto,
) => {
  const baseResponse = {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles: subscriber.subscriberRoles.map((role) => role.role.code),
  };
  const subscriptionDesigneSettings =
    subscriber.subscriptionsBussine.subscriptionDetail[0]
      .subscriptionsDesigneSetting;

  const subscriptionDesign: SubscriptionsDesigneSettingsResponseDto[] =
    subscriptionDesigneSettings.map((setting) => ({
      subscriptionsDesigneSettingId: setting?.subscribersDesigneSettingId,
      mode: setting.designerMode.code,
      url: setting.url,
      brandOne: setting?.brandOne,
      brandTwo: setting?.brandTwo,
      brandThree: setting?.brandThree,
      brandFour: setting?.brandFour,
      primaryColor: setting?.primaryColor,
      secondaryColor: setting?.secondaryColor,
      baseColor: setting?.baseColor,
      infoColor: setting?.infoColor,
      warningColor: setting?.warningColor,
      successColor: setting?.successColor,
      errorColor: setting?.errorColor,
      backgroundColor: setting?.backgroundColor,
      surfaceColor: setting?.surfaceColor,
      onPrimaryColor: setting?.onPrimaryColor,
      onSecondaryColor: setting?.onSecondaryColor,
      onBackgroundColor: setting?.onBackgroundColor,
      onSurfaceColor: setting?.onSurfaceColor,
      letterFont: setting?.letterFont,
    }));
  return {
    ...baseResponse,
    naturalPerson,
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine?.subscription?.subscriptionId,
      subscriptionBussineId:
        subscriber.subscriptionsBussine?.subscriptionBussineId,
      subscriptionDetailId:
        subscriber.subscriptionsBussine?.subscriptionDetail[0]
          .subscriptionDetailId,
      status: subscriber.subscriptionsBussine.subscription?.status,
      initialDate:
        subscriber.subscriptionsBussine.subscription?.initialDate?.toISOString(),
      finalDate:
        subscriber.subscriptionsBussine.subscription?.finalDate?.toISOString(),
      url: subscriber.subscriptionsBussine.subscription?.url,
      subscriptionDesign,
      person: subscriptionPersonData,
    },
  };
};
