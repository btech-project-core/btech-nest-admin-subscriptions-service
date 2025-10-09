import { FindByDomainOrSubscriptionDetailIdResponseDtoItem } from '../dto/find-by-domain-or-subscription-detail-id.dto';
import { SubscriptionsDesigneSetting } from '../entities/subscriptions-designe-setting.entity';

export const formatFindByDomainOrSubscriptionDetailIdResponse = (
  subscriptionsDesigneSetting: SubscriptionsDesigneSetting,
): FindByDomainOrSubscriptionDetailIdResponseDtoItem => {
  return {
    subscriptionsDesigneSettingId:
      subscriptionsDesigneSetting.subscriptionsDesigneSettingId,
    mode: subscriptionsDesigneSetting.subscriptionDetailDesigneMode.designerMode
      .code,
    isPrimary:
      subscriptionsDesigneSetting.subscriptionDetailDesigneMode.isPrimary,
    url: subscriptionsDesigneSetting.url,
    brandOne: subscriptionsDesigneSetting.brandOne,
    brandTwo: subscriptionsDesigneSetting.brandTwo,
    brandThree: subscriptionsDesigneSetting.brandThree,
    brandFour: subscriptionsDesigneSetting.brandFour,
    primaryColor: subscriptionsDesigneSetting.primaryColor,
    secondaryColor: subscriptionsDesigneSetting.secondaryColor,
    baseColor: subscriptionsDesigneSetting.baseColor,
    infoColor: subscriptionsDesigneSetting.infoColor,
    warningColor: subscriptionsDesigneSetting.warningColor,
    successColor: subscriptionsDesigneSetting.successColor,
    errorColor: subscriptionsDesigneSetting.errorColor,
    backgroundColor: subscriptionsDesigneSetting.backgroundColor,
    surfaceColor: subscriptionsDesigneSetting.surfaceColor,
    onPrimaryColor: subscriptionsDesigneSetting.onPrimaryColor,
    onSecondaryColor: subscriptionsDesigneSetting.onSecondaryColor,
    onBackgroundColor: subscriptionsDesigneSetting.onBackgroundColor,
    onSurfaceColor: subscriptionsDesigneSetting.onSurfaceColor,
    letterFont: subscriptionsDesigneSetting.letterFont,
  };
};
