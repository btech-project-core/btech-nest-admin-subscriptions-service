import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { validateSubscriptionDates } from '../helpers/validate-subscription-dates.helper';
import { StatusSubscription } from '../enums/status-subscription.enum';
import { DocumentUsersService } from 'src/common/services/document-users.service';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { ModalitySubscription } from '../enums/modality-subscription.enum';
import { SubscriptionsBussinesCoreService } from 'src/subscriptions-bussines/services/subscriptions-bussines-core.service';
import { SubscribersBulkService } from 'src/subscribers/services/subscribers-bulk.service';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';

@Injectable()
export class SubscriptionsCustomService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly documentUsersService: DocumentUsersService,
    private readonly subscriptionsBussinesCoreService: SubscriptionsBussinesCoreService,
    private readonly subscribersBulkService: SubscribersBulkService,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ): Promise<Subscription> {
    const { initialDate, finalDate, contractSigningDate } =
      createSubscriptionDto;
    validateSubscriptionDates(initialDate, finalDate, contractSigningDate);
    const calculatedStatus = this.calculateSubscriptionStatus(initialDate);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;

    const subscription = repository.create({
      ...createSubscriptionDto,
      status: calculatedStatus,
    });

    await repository.save(subscription);
    return subscription;
  }

  async createSubscriptionsBussine(
    createSubscriptionDto: CreateSubscriptionDto,
    subscription: Subscription,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    const { modality, personId, subscriptionsBusiness } = createSubscriptionDto;

    if (modality === ModalitySubscription.CORPORATE) {
      for (const dto of subscriptionsBusiness) {
        const subscriptionsBussine =
          await this.subscriptionsBussinesCoreService.create(
            subscription,
            dto,
            subscriptionsServices,
            queryRunner,
          );

        if (dto.naturalPersons && dto.naturalPersons.length > 0) {
          await this.subscribersBulkService.createSubscribersForNaturalPersons(
            dto.naturalPersons,
            subscriptionsBussine,
            subscriptionsBussine.subscriptionDetail, // Pasar todos los subscriptionDetails de esta empresa
            queryRunner,
          );
        }
      }
    } else {
      const businessDto = subscriptionsBusiness[0];
      const subscriptionsBussine =
        await this.subscriptionsBussinesCoreService.create(
          subscription,
          {
            personId,
            subscriptionDetails: businessDto.subscriptionDetails,
          },
          subscriptionsServices,
          queryRunner,
        );

      if (businessDto.naturalPersons && businessDto.naturalPersons.length > 0) {
        await this.subscribersBulkService.createSubscribersForNaturalPersons(
          businessDto.naturalPersons,
          subscriptionsBussine,
          subscriptionsBussine.subscriptionDetail, // Pasar todos los subscriptionDetails de esta empresa
          queryRunner,
        );
      }
    }
  }

  async validateUsersWithSubscription(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    return await this.documentUsersService.validateUserDocument(file);
  }

  private calculateSubscriptionStatus(initialDate: string): StatusSubscription {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(initialDate);
    startDate.setHours(0, 0, 0, 0);
    if (startDate <= today) return StatusSubscription.ACTIVE;
    return StatusSubscription.PENDING;
  }
}
