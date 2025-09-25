import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberRole } from '../entities/subscriber-role.entity';
import { SubscribersSubscriptionDetail } from '../../subscribers-subscription-detail/entities/subscribers-subscription-detail.entity';
import { Role } from '../../roles/entities/role.entity';

@Injectable()
export class SubscriberRoleCoreService {
  constructor(
    @InjectRepository(SubscriberRole)
    private readonly subscriberRoleRepository: Repository<SubscriberRole>,
  ) {}

  async create(
    subscribersSubscriptionDetail: SubscribersSubscriptionDetail,
    role: Role,
    isActive: boolean = true,
  ): Promise<SubscriberRole> {
    const subscriberRole = this.subscriberRoleRepository.create({
      subscribersSubscriptionDetail,
      role,
      isActive,
    });
    return await this.subscriberRoleRepository.save(subscriberRole);
  }
}
