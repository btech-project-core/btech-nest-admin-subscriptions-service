import { Subscriber } from '../entities/subscriber.entity';
import { FindOneSubscriberByIdResponseDto } from '../dto/find-one-subscriber-by-id.dto';

export const formatFindOneSubscriberIdResponse = (
  subscriber: Subscriber,
): FindOneSubscriberByIdResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    url: 'BTECH',
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    twoFactorSecret: subscriber.twoFactorSecret || undefined,
  };
};
