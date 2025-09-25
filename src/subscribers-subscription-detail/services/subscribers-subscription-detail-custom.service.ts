import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscribersSubscriptionDetail } from '../entities/subscribers-subscription-detail.entity';

@Injectable()
export class SubscribersSubscriptionDetailCustomService {
  constructor(
    @InjectRepository(SubscribersSubscriptionDetail)
    private readonly subscribersSubscriptionDetailRepository: Repository<SubscribersSubscriptionDetail>,
  ) {}

  // Consultas especializadas se implementarán según requerimientos
}
