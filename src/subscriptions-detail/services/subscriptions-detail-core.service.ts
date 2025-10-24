import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscriptionDetail } from '../entities/subscription-detail.entity';
import { CreateSubscriptionDetailDto } from '../dto/create-subscription-detail.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { NaturalPersonForSubscriberDto } from 'src/subscriptions-bussines/dto';
import { SubscribersCustomService } from 'src/subscribers/services';

@Injectable()
export class SubscriptionsDetailCoreService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionsDetailsRepository: Repository<SubscriptionDetail>,
    @Inject(forwardRef(() => SubscribersCustomService))
    private readonly subscribersCustomService: SubscribersCustomService,
  ) {}
  async create(
    subscriptionsBussine: SubscriptionsBussine,
    createSubscriptionDetailsDto: CreateSubscriptionDetailDto[],
    subscriptionsServices: SubscriptionsService[],
    naturalPersonForSubscriberDto?: NaturalPersonForSubscriberDto[],
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

    const savedSubscriptionDetails = await repository.save(subscriptionDetails);

    for (let i = 0; i < savedSubscriptionDetails.length; i++) {
      if (naturalPersonForSubscriberDto && naturalPersonForSubscriberDto[i]) {
        await this.subscribersCustomService.createSubscriberAlternal(
          naturalPersonForSubscriberDto[i].documentNumber,
          naturalPersonForSubscriberDto[i].documentNumber,
          naturalPersonForSubscriberDto[i].naturalPersonId,
          subscriptionsBussine,
          savedSubscriptionDetails[i],
          'ADM',
        );
      }
    }

    return savedSubscriptionDetails;
  }
}
