import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { SubscriptionDetail } from '../entities/subscription-detail.entity';
import { FindActiveSubscriptionDetailsByBussinesIdResponseDto } from '../dto/find-active-subscription-details-by-bussines-id.dto';
import { CreateSubscriptionDetailDto } from '../dto/create-subscription-detail.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';

@Injectable()
export class SubscriptionsDetailService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionsDetailsRepository: Repository<SubscriptionDetail>,
  ) {}
  async create(
    subscriptionsBussine: SubscriptionsBussine,
    createSubscriptionDetailsDto: CreateSubscriptionDetailDto[],
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ): Promise<SubscriptionDetail[]> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(SubscriptionDetail)
      : this.subscriptionsDetailsRepository;

    const subscriptionDetails: SubscriptionDetail[] = [];
    for (let i = 0; i < createSubscriptionDetailsDto.length; i++) {
      const dto = createSubscriptionDetailsDto[i];
      const subscriptionsService = subscriptionsServices.find(
        (service) =>
          service.subscriptionsServiceId === dto.subscriptionServiceId,
      );

      const subscriptionDetail = repository.create();
      subscriptionDetail.initialDate = new Date(dto.initialDate);
      subscriptionDetail.finalDate = new Date(dto.finalDate);
      subscriptionDetail.subscriptionsBussine = subscriptionsBussine;
      if (subscriptionsService)
        subscriptionDetail.subscriptionsService = subscriptionsService;
      subscriptionDetails.push(subscriptionDetail);
    }

    return await repository.save(subscriptionDetails);
  }

  async findActiveSubscriptionDetailsByBussinesId(
    subscriptionBussineId: string,
  ): Promise<FindActiveSubscriptionDetailsByBussinesIdResponseDto[]> {
    return await this.subscriptionsDetailsRepository
      .createQueryBuilder('sd')
      .innerJoin('sd.subscriptionsBussine', 'sb')
      .innerJoin('sb.subscription', 's')
      .select(['sd.subscriptionDetailId', 'sd.serviceId'])
      .where('sb.subscriptionBussineId = :subscriptionBussineId', {
        subscriptionBussineId,
      })
      .andWhere('s.status = :status', { status: StatusSubscription.ACTIVE })
      .getMany();
  }
}
