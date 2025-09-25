import { CreateSubscriptionsBussineDto } from 'src/subscriptions-bussines/dto/create-subscriptions-bussine.dto';

export const extractAllServiceIds = (
  subscriptionsBusiness: CreateSubscriptionsBussineDto[],
): string[] => {
  const serviceIds: string[] = [];
  subscriptionsBusiness.forEach((business) => {
    business.subscriptionDetails.forEach((detail) => {
      serviceIds.push(detail.subscriptionServiceId);
    });
  });
  return [...new Set(serviceIds)];
};
