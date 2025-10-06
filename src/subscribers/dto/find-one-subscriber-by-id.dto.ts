export class FindOneSubscriberByIdResponseDto {
  subscriberId: string;
  username: string;
  url?: string;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string | undefined;
  hashedPassword?: string | null;
}
