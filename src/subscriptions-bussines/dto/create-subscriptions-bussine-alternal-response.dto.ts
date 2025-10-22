export class CreateSubscriptionsBussineAlternalResponseDto {
  subscriptionBussineId: string;
  personId: string;
  numberAccounts: number;
  subscription: {
    subscriptionId: string;
    initialDate: Date;
    finalDate: Date;
    contractSigningDate: Date;
    url?: string;
    personId: string;
    status: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
