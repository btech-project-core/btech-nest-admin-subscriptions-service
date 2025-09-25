import { IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSubscribersSubscriptionDetailDto {
  @IsUUID()
  subscribersSubscriptionDetailId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSubscribersSubscriptionDetailResponseDto {
  subscribersSubscriptionDetailId: string;
  subscriberId: string;
  subscriptionDetailId: string;
  isActive: boolean;
  updatedAt: Date;
}
