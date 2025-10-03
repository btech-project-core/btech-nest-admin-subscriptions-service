import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import {
  FindSubscribersWithNaturalPersonsDto,
  SubscriberWithNaturalPersonDto,
} from '../dto/find-subscribers-with-natural-persons.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { SubscribersSubscriptionDetailCoreService } from '../../subscribers-subscription-detail/services/subscribers-subscription-detail-core.service';
import { SubscriberRoleCoreService } from './subscriber-role-core.service';
import { RolesCustomService } from '../../roles/services/roles-custom.service';
import { SubscriptionDetail } from '../../subscriptions-detail/entities/subscription-detail.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SubscribersBulkService {
  // Cache para el count de subscribers por subscriptionDetailId
  private countCache = new Map<string, { count: number; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly subscriberRoleCoreService: SubscriberRoleCoreService,
    private readonly rolesCustomService: RolesCustomService,
  ) {}

  async findSubscribersWithNaturalPersons(
    findDto: FindSubscribersWithNaturalPersonsDto,
  ): Promise<PaginationResponseDto<SubscriberWithNaturalPersonDto>> {
    const { subscriptionDetailId, term, subscriberIds, ...paginationDto } =
      findDto;
    const { page = 1, limit = 8 } = paginationDto;
    const skip = (page - 1) * limit;

    // Crear query base
    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .innerJoin('subscriber.subscriptionsBussine', 'subscriptionsBussine')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .innerJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .innerJoin(
        'subscribersSubscriptionDetails.subscriptionDetail',
        'subscriptionDetail',
      )
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId,
        },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriber.subscriberId IN (:...subscriberIds)', {
        subscriberIds,
      });

    // Aplicar filtro por term en username si existe
    if (term && term.trim() !== '') {
      const searchTerm = `%${term.toLowerCase().trim()}%`;
      queryBuilder.andWhere('LOWER(subscriber.username) LIKE :searchTerm', {
        searchTerm,
      });
    }

    queryBuilder
      .select([
        'subscriber.subscriberId',
        'subscriber.username',
        'subscriber.naturalPersonId',
        'subscriber.createdAt',
      ])
      .orderBy('subscriber.createdAt', 'DESC');

    const data = await queryBuilder.skip(skip).take(limit).getMany();

    if (data.length === 0)
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };

    // Obtener el count con cache
    const total = await this.getCachedCount(subscriptionDetailId, queryBuilder);
    // Pasar el term al servicio de natural persons
    const naturalPersonsData =
      await this.adminPersonsService.findMultipleNaturalPersonsByIds({
        naturalPersonIds: data.map((s) => s.naturalPersonId),
        term,
      });
    const naturalPersonsMap = new Map(
      naturalPersonsData.map((np) => [np.naturalPersonId, np]),
    );
    const subscribersWithNaturalPersons = data.map((subscriber) => ({
      subscriberId: subscriber.subscriberId,
      username: subscriber.username,
      naturalPerson: naturalPersonsMap.get(subscriber.naturalPersonId)!,
    }));
    return {
      data: subscribersWithNaturalPersons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene el count con cache para evitar queries lentos en cada paginación
   */
  private async getCachedCount(
    subscriptionDetailId: string,
    queryBuilder: SelectQueryBuilder<Subscriber>,
  ): Promise<number> {
    const cacheKey = `count_${subscriptionDetailId}`;
    const cached = this.countCache.get(cacheKey);
    const now = Date.now();

    // Si existe en cache y no ha expirado, retornar
    if (cached && now - cached.timestamp < this.CACHE_TTL) return cached.count;
    // Ejecutar count y guardar en cache
    const count = await queryBuilder.getCount();
    this.countCache.set(cacheKey, { count, timestamp: now });
    return count;
  }

  invalidateCountCache(subscriptionDetailId: string): void {
    const cacheKey = `count_${subscriptionDetailId}`;
    this.countCache.delete(cacheKey);
  }

  async createSubscribersForNaturalPersons(
    naturalPersons: { naturalPersonId: string; documentNumber: string }[],
    subscriptionsBussine: SubscriptionsBussine,
    subscriptionDetails: SubscriptionDetail[], // Los servicios específicos para los que crear acceso
    queryRunner?: QueryRunner,
  ): Promise<Subscriber[]> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscriber)
      : this.subscriberRepository;
    // 1. Verificar duplicados en el request actual (no debería haber naturalPersonIds duplicados)
    const naturalPersonIds = naturalPersons.map((np) => np.naturalPersonId);
    const uniqueIds = new Set(naturalPersonIds);
    if (uniqueIds.size !== naturalPersonIds.length)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se pueden enviar naturalPersonIds duplicados en la misma solicitud',
      });
    // Obtener el rol por defecto para usuarios nuevos
    const defaultRole = await this.rolesCustomService.findOneByCode('SAD');

    const subscribersToCreate = await Promise.all(
      naturalPersons.map(async (naturalPerson) => {
        const { naturalPersonId, documentNumber } = naturalPerson;
        const username = documentNumber;
        const hashedPassword = await bcryptjs.hash(username, 10);

        return repository.create({
          username,
          password: hashedPassword,
          naturalPersonId,
          subscriptionsBussine,
          isConfirm: true,
        });
      }),
    );

    // 2. Guardar todos los subscribers en una sola operación
    const savedSubscribers = await repository.save(subscribersToCreate);

    // 3. Crear relaciones intermedias y roles para cada subscriber y cada subscriptionDetail
    for (const subscriber of savedSubscribers) {
      // Crear la relación intermedia y rol para cada servicio
      for (const subscriptionDetail of subscriptionDetails) {
        const subscribersSubscriptionDetail =
          await this.subscribersSubscriptionDetailCoreService.create(
            subscriber,
            subscriptionDetail,
            true,
          );

        // Asignar el rol por defecto para este servicio específico
        await this.subscriberRoleCoreService.create(
          subscribersSubscriptionDetail,
          defaultRole,
          true,
        );
      }
    }

    return savedSubscribers;
  }
}
