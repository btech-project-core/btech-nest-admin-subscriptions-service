import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscription } from '../entities/subscription.entity';
import { StatusSubscription } from '../enums/status-subscription.enum';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { ModalitySubscription } from '../enums/modality-subscription.enum';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { CreateSubscriptionsBussineDto } from 'src/subscriptions-bussines/dto/create-subscriptions-bussine.dto';
import { extractAllServiceIds } from '../helpers/extract-all-service-ids.helper';
import { extractAllPersonIds } from '../helpers/extract-all-person-ids.helper';
import { SubscriptionsServicesValidateService } from 'src/subscriptions-services/services/subscriptions-services-validate.service';

@Injectable()
export class SubscriptionsValidateService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly subscriptionsServicesValidateService: SubscriptionsServicesValidateService,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async checkActiveSubscriptionsByPersonId(personId: string): Promise<boolean> {
    const activeSubscriptionsCount = await this.subscriptionsRepository.count({
      where: {
        personId,
        status: StatusSubscription.ACTIVE,
      },
    });
    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede proceder porque la persona tiene ${activeSubscriptionsCount} suscripción(es) activa(s)`,
      });
    return true;
  }

  validateCorporateSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): void {
    const { modality, subscriptionsBusiness } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      if (!subscriptionsBusiness || subscriptionsBusiness.length === 0)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad corporativa se requiere al menos un subscription business',
        });
      subscriptionsBusiness.forEach((business) => {
        if (!business.personId)
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            message:
              'Para modalidad corporativa, cada subscription business debe tener un personId',
          });
      });
    } else {
      if (subscriptionsBusiness.length !== 1)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad no corporativa se requiere exactamente un subscription business',
        });
    }
  }

  async validateAllRequiredEntities(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ subscriptionsServices: any[] }> {
    const { subscriptionsBusiness } = createSubscriptionDto;
    this.validateUniqueSubscriptionServices(subscriptionsBusiness);
    const allServiceIds = extractAllServiceIds(subscriptionsBusiness);
    const allPersonIds = extractAllPersonIds(createSubscriptionDto);
    const subscriptionsServices =
      await this.subscriptionsServicesValidateService.validateSubscriptionServicesExist(
        allServiceIds,
      );
    if (allPersonIds.length > 0)
      await this.adminPersonsService.validatePersonsExist(allPersonIds);

    return { subscriptionsServices };
  }

  async validateDuplicateAndOverlap(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const { personId, initialDate, finalDate } = createSubscriptionDto;
    await this.validateNoDateOverlap(
      personId,
      initialDate,
      finalDate,
      queryRunner,
    );
  }

  async validateNoDateOverlap(
    personId: string,
    initialDate: string,
    finalDate: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;

    const startDate = new Date(initialDate);
    const endDate = new Date(finalDate);
    const overlappingSubscriptions = await repository
      .createQueryBuilder('subscription')
      .where('subscription.personId = :personId', { personId })
      .andWhere('subscription.status IN (:...statuses)', {
        statuses: ['ACTIVE', 'PENDING'],
      })
      .andWhere('subscription.initialDate <= :endDate', { endDate })
      .andWhere('subscription.finalDate >= :startDate', { startDate })
      .getCount();

    if (overlappingSubscriptions > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede crear la suscripción porque las fechas se solapan con ${overlappingSubscriptions} suscripción(es) existente(s) para esta persona`,
      });
  }

  private validateUniqueSubscriptionServices(
    subscriptionsBusiness: CreateSubscriptionsBussineDto[],
  ): void {
    const allServiceIds: string[] = [];
    subscriptionsBusiness.forEach((business) => {
      business.subscriptionDetails.forEach((detail) => {
        allServiceIds.push(detail.subscriptionServiceId);
      });
    });

    const duplicateIds = allServiceIds.filter(
      (id, index) => allServiceIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Servicios de suscripción duplicados encontrados: ${[...new Set(duplicateIds)].join(', ')}`,
      });
  }
}
