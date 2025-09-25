import { IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubscribersSubscriptionDetailDto {
  @IsUUID()
  subscriberId: string;

  @IsUUID()
  subscriptionDetailId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateSubscribersSubscriptionDetailResponseDto {
  subscribersSubscriptionDetailId: string;
  subscriberId: string;
  subscriptionDetailId: string;
  isActive: boolean;
  createdAt: Date;
}
