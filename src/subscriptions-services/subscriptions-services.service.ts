import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from './entities/subscriptions-service.entity';
import { Brackets, Repository } from 'typeorm';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from './dto/find-all-subscription-service.dto';
import { formatSubscriptionsServiceResponse } from './helpers/format-subscriptions-service-response.helper';
import { RpcException } from '@nestjs/microservices';
import {
  CreateSubscriptionsServiceDto,
  CreateSubscriptionsServiceResponseDto,
} from './dto/create-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceDto,
  UpdateSubscriptionsServiceResponseDto,
} from './dto/update-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceStatusDto,
  UpdateSubscriptionsServiceStatusResponseDto,
} from './dto/update-subscriptions-service-status.dto';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';

@Injectable()
export class SubscriptionsServicesService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async create(
    createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ): Promise<CreateSubscriptionsServiceResponseDto> {
    const subscriptionsService = this.subscriptionsServicesRepository.create(
      createSubscriptionsServiceDto,
    );
    await this.subscriptionsServicesRepository.save(subscriptionsService);
    return formatSubscriptionsServiceResponse(subscriptionsService);
  }

  async findAll(
    findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<
    | FindAllSubscriptionsServiceResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsServiceResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllSubscriptionsServiceDto;
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
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriptionsService.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('subscriptionsService.createdAt', 'DESC');
    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriptionsServiceResponse(data),
        ),
      };
    }
    const subscriptionsServices = await queryBuilder.getMany();
    return subscriptionsServices.map(formatSubscriptionsServiceResponse);
  }

  async findOne(subscriptionsServiceId: string): Promise<SubscriptionsService> {
    const subscriptionsService =
      await this.subscriptionsServicesRepository.findOne({
        where: { subscriptionsServiceId: subscriptionsServiceId.trim() },
      });
    if (!subscriptionsService)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Servicio de suscripción con ID '${subscriptionsServiceId}' no encontrado`,
      });
    return subscriptionsService;
  }

  async update(
    updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ): Promise<UpdateSubscriptionsServiceResponseDto> {
    const { subscriptionsServiceId, code, description } =
      updateSubscriptionsServiceDto;
    const subscriptionsService = await this.findOne(subscriptionsServiceId);
    subscriptionsService.code = code ?? subscriptionsService.code;
    subscriptionsService.description =
      description ?? subscriptionsService.description;
    await this.subscriptionsServicesRepository.save(subscriptionsService);
    return formatSubscriptionsServiceResponse(subscriptionsService);
  }

  async updateStatus(
    updateSubscriptionsServiceStatusDto: UpdateSubscriptionsServiceStatusDto,
  ): Promise<UpdateSubscriptionsServiceStatusResponseDto> {
    const { subscriptionsServiceId, isActive } =
      updateSubscriptionsServiceStatusDto;
    const existingService = await this.findOne(subscriptionsServiceId);
    if (!isActive)
      await this.validateActiveSubscriptions(subscriptionsServiceId);
    await this.subscriptionsServicesRepository.update(subscriptionsServiceId, {
      isActive,
    });
    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Servicio de suscripción '${existingService.description}' ${statusMessage} exitosamente`,
    };
  }

  // ✅ Método privado especializado y eficiente
  private async validateActiveSubscriptions(
    subscriptionsServiceId: string,
  ): Promise<void> {
    const activeSubscriptionsCount = await this.subscriptionsServicesRepository
      .createQueryBuilder('subscriptionsService')
      .innerJoin(
        'subscriptionsService.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .where(
        'subscriptionsService.subscriptionsServiceId = :subscriptionsServiceId',
        {
          subscriptionsServiceId,
        },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .getCount();
    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el servicio porque tiene suscripciones activas asociadas',
      });
  }
}
