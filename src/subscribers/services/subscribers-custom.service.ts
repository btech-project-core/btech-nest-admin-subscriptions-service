import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import { FindOneSubscriberByIdResponseDto } from '../dto/find-one-subscriber-by-id.dto';
import { formatFindOneSubscriberIdResponse } from '../helpers/format-find-one-subscriber-id-response.helper';
import { formatSubscriberCompleteInfoResponse } from '../helpers/format-get-subscriber-complete-info.helper';
import { SubscriberCompleteInfoResponseDto } from 'src/common/dto/subscriber-complete-info.dto';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { CodeService } from 'src/common/enums/code-service.enum';
import { SERVICE_NAME } from 'src/config/constants';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { envs } from 'src/config/envs.config';
import { CodeFeatures } from 'src/common/enums/code-features.enum';

@Injectable()
export class SubscribersCustomService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async findOneBySubscriberId(
    subscriberId: string,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      });
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario no se encuentra registrado`,
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'El usuario se encuentra sin suscripción activa',
      });
    return formatFindOneSubscriberIdResponse(subscriber);
  }

  async getSubscriberCompleteInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberCompleteInfoResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');

    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (service)
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });

    const subscriber = await queryBuilder.getOne();

    if (!subscriber)
      throw new RpcException({
        message: `El subscriber con id ${subscriberId} no se encuentra registrado`,
        service: SERVICE_NAME,
      });

    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonBySubscriberId(
        subscriber.naturalPersonId,
      );

    const subscriptionPersonData =
      await this.adminPersonsService.findOneSubscriptionPersonData(
        subscriber.subscriptionsBussine.personId,
      );

    return formatSubscriberCompleteInfoResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
    );
  }

  async querySubscriberByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<Subscriber | null> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsDesigneSetting',
        'subscriptionsDesigneSetting',
      )
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where('subscriber.username = :username', { username })
      .andWhere('subscriptionsService.code = :service', { service })
      .andWhere(
        'subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId',
      )
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (service === CodeService.VDI && domain !== envs.domain.principal) {
      queryBuilder
        .leftJoinAndSelect(
          'subscriptionDetail.subscriptionDetailFeatures',
          'subscriptionDetailFeatures',
        )
        .leftJoinAndSelect(
          'subscriptionDetailFeatures.subscriptionFeatures',
          'subscriptionFeatures',
        );
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
            { subscriptionDetailId: domain },
          ).orWhere(
            'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
            {
              code: CodeFeatures.DOM,
              domain: domain,
            },
          );
        }),
      );
    }
    return await queryBuilder.getOne();
  }

  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    console.log('[INICIO] Obteniendo IDs de naturalPersons válidos...');
    const startNP = Date.now();
    const validNaturalPersonIds =
      await this.adminPersonsService.findAllNaturalPersonIds();
    console.log(
      `[NATURAL_PERSONS] ${validNaturalPersonIds.length} IDs válidos obtenidos en ${Date.now() - startNP}ms`,
    );

    console.log('[QUERY] Obteniendo todos los subscribers...');
    const startQuery = Date.now();
    const allSubscribers = await this.subscriberRepository.find({
      select: ['subscriberId', 'naturalPersonId'],
    });
    console.log(
      `[QUERY COMPLETADO] ${allSubscribers.length} subscribers obtenidos en ${Date.now() - startQuery}ms`,
    );

    console.log('[FILTRADO] Buscando subscribers huérfanos...');
    const startFilter = Date.now();
    const validNaturalPersonIdsSet = new Set(validNaturalPersonIds);
    const orphanedSubscribers = allSubscribers.filter(
      (subscriber) => !validNaturalPersonIdsSet.has(subscriber.naturalPersonId),
    );
    console.log(
      `[FILTRADO COMPLETADO] ${orphanedSubscribers.length} huérfanos encontrados en ${Date.now() - startFilter}ms`,
    );

    if (orphanedSubscribers.length === 0) {
      return {
        message: 'No se encontraron subscribers huérfanos para eliminar',
      };
    }

    console.log('[MAPEO] Extrayendo IDs...');
    const orphanedSubscriberIds = orphanedSubscribers.map(
      (sub) => sub.subscriberId,
    );
    console.log(`[MAPEO COMPLETADO] ${orphanedSubscriberIds.length} IDs`);

    // Guardar el JSON ANTES de eliminar
    console.log('[GUARDANDO JSON] Escribiendo archivo...');
    const startFile = Date.now();
    const fs = await import('fs/promises');
    const path = await import('path');
    const outputPath = path.join(
      process.cwd(),
      'deleted-subscribers-alternal.json',
    );

    await fs.writeFile(
      outputPath,
      JSON.stringify(orphanedSubscriberIds, null, 2),
    );
    console.log(
      `[JSON GUARDADO] Archivo guardado en ${outputPath} (${Date.now() - startFile}ms)`,
    );

    // Eliminar en batches para evitar problemas con queries muy grandes
    console.log('[ELIMINACIÓN] Iniciando eliminación en batches...');
    const startDelete = Date.now();
    const batchSize = 1000;
    for (let i = 0; i < orphanedSubscriberIds.length; i += batchSize) {
      const batchStart = Date.now();
      const batch = orphanedSubscriberIds.slice(i, i + batchSize);
      await this.subscriberRepository.delete(batch);
      console.log(
        `[BATCH ${Math.floor(i / batchSize) + 1}] Eliminados ${Math.min(i + batchSize, orphanedSubscriberIds.length)}/${orphanedSubscriberIds.length} subscribers (${Date.now() - batchStart}ms)`,
      );
    }
    console.log(
      `[ELIMINACIÓN COMPLETADA] Total: ${Date.now() - startDelete}ms`,
    );

    return {
      message: `Se eliminaron ${orphanedSubscribers.length} subscribers huérfanos (sin naturalPerson válido). IDs guardados en: ${outputPath}`,
    };
  }
}
