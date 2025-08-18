import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsType } from './entities/subscriptions-type.entity';
import {
  CreateSubscriptionsTypeDto,
  CreateSubscriptionsTypeResponseDto,
} from './dto/create-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeDto,
  UpdateSubscriptionsTypeResponseDto,
} from './dto/update-subscriptions-type.dto';
import {
  FindAllSubscriptionsTypeDto,
  FindAllSubscriptionsTypeResponseDto,
} from './dto/find-all-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeStatusDto,
  UpdateSubscriptionsTypeStatusResponseDto,
} from './dto/update-subscriptions-type-status.dto';
import {
  FindOneSubscriptionsTypeDto,
  FindOneSubscriptionsTypeResponseDto,
} from './dto/find-one-subscriptions-type.dto';
import { formatSubscriptionsTypeResponse } from './helpers/format-subscriptions-type-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class SubscriptionsTypeService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
  ) {}

  async create(
    createSubscriptionsTypeDto: CreateSubscriptionsTypeDto,
  ): Promise<CreateSubscriptionsTypeResponseDto> {
    const subscriptionsType = this.subscriptionsTypeRepository.create(
      createSubscriptionsTypeDto,
    );
    await this.subscriptionsTypeRepository.save(subscriptionsType);
    return formatSubscriptionsTypeResponse(subscriptionsType);
  }

  async findAll(
    findAllSubscriptionsTypeDto: FindAllSubscriptionsTypeDto,
  ): Promise<
    | FindAllSubscriptionsTypeResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsTypeResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllSubscriptionsTypeDto;
    const queryBuilder =
      this.subscriptionsTypeRepository.createQueryBuilder('subscriptionsType');

    if (term)
      queryBuilder.andWhere('subscriptionsType.description LIKE :term', {
        term: `%${term}%`,
      });
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriptionsType.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('subscriptionsType.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriptionsTypeResponse(data),
        ),
      };
    }
    const subscriptionsTypes = await queryBuilder.getMany();
    return subscriptionsTypes.map(formatSubscriptionsTypeResponse);
  }

  async findOneByDto(
    findOneDto: FindOneSubscriptionsTypeDto,
  ): Promise<FindOneSubscriptionsTypeResponseDto> {
    const subscriptionsType = await this.findOne(findOneDto.subscriptionTypeId);
    return {
      ...formatSubscriptionsTypeResponse(subscriptionsType),
      createdAt: subscriptionsType.createdAt,
      updatedAt: subscriptionsType.updatedAt,
    };
  }

  async findOne(subscriptionTypeId: string): Promise<SubscriptionsType> {
    const subscriptionsType = await this.subscriptionsTypeRepository.findOne({
      where: { subscriptionTypeId: subscriptionTypeId.trim() },
    });
    if (!subscriptionsType)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Tipo de suscripción con ID '${subscriptionTypeId}' no encontrado`,
      });
    return subscriptionsType;
  }

  async update(
    updateSubscriptionsTypeDto: UpdateSubscriptionsTypeDto,
  ): Promise<UpdateSubscriptionsTypeResponseDto> {
    const { subscriptionTypeId, description } = updateSubscriptionsTypeDto;
    const subscriptionsType = await this.findOne(subscriptionTypeId);

    subscriptionsType.description =
      description ?? subscriptionsType.description;

    await this.subscriptionsTypeRepository.save(subscriptionsType);
    return formatSubscriptionsTypeResponse(subscriptionsType);
  }

  async updateStatus(
    updateSubscriptionsTypeStatusDto: UpdateSubscriptionsTypeStatusDto,
  ): Promise<UpdateSubscriptionsTypeStatusResponseDto> {
    const { subscriptionTypeId, isActive } = updateSubscriptionsTypeStatusDto;
    const existingSubscriptionsType = await this.findOne(subscriptionTypeId);

    if (!isActive) await this.relatedSubscriptions(subscriptionTypeId);

    await this.subscriptionsTypeRepository.update(subscriptionTypeId, {
      isActive,
    });

    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Tipo de suscripción '${existingSubscriptionsType.description}' ${statusMessage} exitosamente`,
    };
  }

  private async relatedSubscriptions(
    subscriptionTypeId: string,
  ): Promise<void> {
    const relatedSubscriptionsCount = await this.subscriptionsTypeRepository
      .createQueryBuilder('subscriptionsType')
      .innerJoin('subscriptionsType.subscriptions', 'subscription')
      .where('subscriptionsType.subscriptionTypeId = :subscriptionTypeId', {
        subscriptionTypeId,
      })
      .andWhere('subscription.isActive = true')
      .andWhere('subscriptionsType.isActive = true')
      .getCount();

    if (relatedSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el tipo de suscripción porque tiene suscripciones asociadas',
      });
  }

  async isValidSubscriptionsType(subscriptionTypeId: string) {
    const subscriptionsType = await this.subscriptionsTypeRepository.findOne({
      where: { subscriptionTypeId, isActive: true },
    });
    if (!subscriptionsType)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Tipo de suscripción con ID ${subscriptionTypeId} no encontrado o inactivo`,
      });
    return subscriptionsType;
  }
}
