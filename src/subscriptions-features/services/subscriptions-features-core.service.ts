import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import {
  CreateSubscriptionFeaturesDto,
  CreateSubscriptionFeaturesResponseDto,
} from '../dto/create-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesDto,
  UpdateSubscriptionFeaturesResponseDto,
} from '../dto/update-subscription-features.dto';
import {
  FindAllSubscriptionFeaturesDto,
  FindAllSubscriptionFeaturesResponseDto,
} from '../dto/find-all-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesStatusDto,
  UpdateSubscriptionFeaturesStatusResponseDto,
} from '../dto/update-subscription-features-status.dto';
import { formatSubscriptionFeaturesResponse } from '../helpers/format-subscription-features-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionFeatures } from '../entities/subscription-features.entity';
import { SubscriptionsFeaturesCustomService } from './subscriptions-features-custom.service';

@Injectable()
export class SubscriptionsFeaturesCoreService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
    private readonly subscriptionsFeaturesCustomService: SubscriptionsFeaturesCustomService,
  ) {}

  async create(
    createSubscriptionFeaturesDto: CreateSubscriptionFeaturesDto,
  ): Promise<CreateSubscriptionFeaturesResponseDto> {
    const subscriptionFeatures = this.subscriptionFeaturesRepository.create(
      createSubscriptionFeaturesDto,
    );
    await this.subscriptionFeaturesRepository.save(subscriptionFeatures);
    return formatSubscriptionFeaturesResponse(subscriptionFeatures);
  }

  async findAll(
    findAllSubscriptionFeaturesDto: FindAllSubscriptionFeaturesDto,
  ): Promise<
    | FindAllSubscriptionFeaturesResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionFeaturesResponseDto>
  > {
    const {
      term,
      isRequired,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllSubscriptionFeaturesDto;
    const queryBuilder = this.subscriptionFeaturesRepository.createQueryBuilder(
      'subscriptionFeatures',
    );

    if (term)
      queryBuilder.andWhere(
        '(subscriptionFeatures.description LIKE :term OR subscriptionFeatures.code LIKE :term)',
        { term: `%${term}%` },
      );
    if (typeof isRequired === 'boolean')
      queryBuilder.andWhere('subscriptionFeatures.isRequired = :isRequired', {
        isRequired,
      });
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriptionFeatures.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('subscriptionFeatures.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriptionFeaturesResponse(data),
        ),
      };
    }
    const subscriptionFeatures = await queryBuilder.getMany();
    return subscriptionFeatures.map(formatSubscriptionFeaturesResponse);
  }

  async findOne(subscriptionFeaturesId: string): Promise<SubscriptionFeatures> {
    const subscriptionFeatures =
      await this.subscriptionFeaturesRepository.findOne({
        where: { subscriptionFeaturesId: subscriptionFeaturesId.trim() },
      });
    if (!subscriptionFeatures)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Característica de suscripción con ID '${subscriptionFeaturesId}' no encontrada`,
      });
    return subscriptionFeatures;
  }

  async update(
    updateSubscriptionFeaturesDto: UpdateSubscriptionFeaturesDto,
  ): Promise<UpdateSubscriptionFeaturesResponseDto> {
    const { subscriptionFeaturesId, code, description, isRequired } =
      updateSubscriptionFeaturesDto;
    const subscriptionFeatures = await this.findOne(subscriptionFeaturesId);

    subscriptionFeatures.code = code ?? subscriptionFeatures.code;
    subscriptionFeatures.description =
      description ?? subscriptionFeatures.description;
    subscriptionFeatures.isRequired =
      isRequired ?? subscriptionFeatures.isRequired;

    await this.subscriptionFeaturesRepository.save(subscriptionFeatures);
    return formatSubscriptionFeaturesResponse(subscriptionFeatures);
  }

  async updateStatus(
    updateSubscriptionFeaturesStatusDto: UpdateSubscriptionFeaturesStatusDto,
  ): Promise<UpdateSubscriptionFeaturesStatusResponseDto> {
    const { subscriptionFeaturesId, isActive } =
      updateSubscriptionFeaturesStatusDto;
    const existingSubscriptionFeatures = await this.findOne(
      subscriptionFeaturesId,
    );
    if (!isActive)
      await this.subscriptionsFeaturesCustomService.relatedSubscriptionDetails(
        subscriptionFeaturesId,
      );
    await this.subscriptionFeaturesRepository.update(subscriptionFeaturesId, {
      isActive,
    });
    const statusMessage = isActive ? 'activada' : 'desactivada';
    return {
      message: `Característica '${existingSubscriptionFeatures.description}' ${statusMessage} exitosamente`,
    };
  }
}
