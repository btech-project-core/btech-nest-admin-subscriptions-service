import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscribersSubscriptionDetail } from '../entities/subscribers-subscription-detail.entity';

@Injectable()
export class SubscribersSubscriptionDetailValidateService {
  constructor(
    @InjectRepository(SubscribersSubscriptionDetail)
    private readonly subscribersSubscriptionDetailRepository: Repository<SubscribersSubscriptionDetail>,
  ) {}

  // Métodos de validación se implementarán según requerimientos
}
