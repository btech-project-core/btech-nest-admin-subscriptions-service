export interface SubscriberAlertLevelValidation {
  subscriberId: string;
  hasAlertLevel: boolean;
  alertMinutesBefore?: number;
  subscriptionDetailId?: string;
}

export interface SubscriberAlertLevelRaw {
  subscriberId: string;
  value: string;
  subscriptionDetailId: string;
}
