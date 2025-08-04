import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from './entities/subscriptions-service.entity';
import { Brackets, Repository } from 'typeorm';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from './dto/find-all-subscription-service.dto';
import { formatSubscriptionsServiceResponse } from './helpers/format-subscriptions-service-response.helper';

@Injectable()
export class SubscriptionsServicesService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async findAll(
    findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<FindAllSubscriptionsServiceResponseDto[]> {
    const { term, isActive } = findAllSubscriptionsServiceDto;
    const queryBuilder =
      this.subscriptionsServicesRepository.createQueryBuilder(
        'subscriptionsService',
      );
    if (term)
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('subscriptionsService.code LIKE :term', {
            term: `%${term}%`,
          }).orWhere('subscriptionsService.description LIKE :term', {
            term: `%${term}%`,
          });
        }),
      );
    if (isActive)
      queryBuilder.andWhere('subscriptionsService.isActive = :isActive', {
        isActive,
      });
    const subscriptionsServices = await queryBuilder.getMany();
    return subscriptionsServices.map(formatSubscriptionsServiceResponse);
  }
}
