import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { validateSubscriptionDates } from './helpers/validate-subscription-dates.helper';
import { TransactionService } from 'src/common/services/transaction.service';
import { SubscriptionsBussinesService } from 'src/subscriptions-bussines/subscriptions-bussines.service';
import { ModalitySubscription } from './enums/modality-subscription.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
  ) {}
  create(createSubscriptionDto: CreateSubscriptionDto) {
    this.validateCorporateSubscription(createSubscriptionDto);
    this.transactionService.runInTransaction(async (qr) => {
      const subscription = await this.createSubscription(
        createSubscriptionDto,
        qr,
      );
      await this.createSubscriptionsBussine(
        createSubscriptionDto,
        subscription.subscriptionId,
        qr,
      );
    });
  }

  private async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ) {
    const { initialDate, finalDate } = createSubscriptionDto;
    validateSubscriptionDates(initialDate, finalDate);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;
    const subscription = repository.create(createSubscriptionDto);
    await repository.save(subscription);
    return subscription;
  }

  private async createSubscriptionsBussine(
    createSubscriptionDto: CreateSubscriptionDto,
    subscriptionId: string,
    queryRunner?: QueryRunner,
  ) {
    const { modality, personId, createSubscriptionsBussineDto } =
      createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE)
      await Promise.all(
        createSubscriptionsBussineDto!.map((dto) =>
          this.subscriptionsBussinesService.create(dto, queryRunner),
        ),
      );
    if (modality !== ModalitySubscription.CORPORATE)
      await this.subscriptionsBussinesService.create(
        {
          subscriptionId,
          personId,
        },
        queryRunner,
      );
  }

  private validateCorporateSubscription = (
    createSubscriptionDto: CreateSubscriptionDto,
  ): void => {
    const { modality, createSubscriptionsBussineDto } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      if (
        !createSubscriptionsBussineDto ||
        createSubscriptionsBussineDto.length === 0
      )
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad corporativa se requiere al menos un subscription business',
        });
    }
  };
}
