import { FindByDomainResponseItemDto } from '../dto/find-by-domain.dto';
import { SubscriptionDetailDesigneMode } from '../entities/subscription-detail-designe-mode.entity';

export const formatFindByDomainResponse = (
  subscriptionDetailDesigneMode: SubscriptionDetailDesigneMode,
): FindByDomainResponseItemDto => {
  const hasDesigneSetting =
    !!subscriptionDetailDesigneMode.subscriptionsDesigneSetting;
  // Si NO tiene configuración de diseño (es PREDETERMINADO POR EL SISTEMA)
  if (!hasDesigneSetting)
    return {
      subscriptionDetailDesigneModeId:
        subscriptionDetailDesigneMode.subscriptionDetailDesigneModeId,
      mode: subscriptionDetailDesigneMode.designerMode.code,
      isPrimary: subscriptionDetailDesigneMode.isPrimary,
    };
  // Si tiene configuración de diseño (CLARO, OSCURO, MULTICOLOR, etc.)
  const setting = subscriptionDetailDesigneMode.subscriptionsDesigneSetting;
  return {
    subscriptionDetailDesigneModeId:
      subscriptionDetailDesigneMode.subscriptionDetailDesigneModeId,
    mode: subscriptionDetailDesigneMode.designerMode.code,
    isPrimary: subscriptionDetailDesigneMode.isPrimary,
    url: setting?.url,
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
  };
};
