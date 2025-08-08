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
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionDto,
  FindAllSubscriptionResponseDto,
} from './dto/find-all-subscription.dto';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { formatSubscriptionResponse } from './helpers/format-subscription-response.helper';
import { DocumentUsersService } from 'src/common/services/document-users.service';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionsBussinesService: SubscriptionsBussinesService,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly documentUsersService: DocumentUsersService,
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

  async findAll(
    findAllSubscriptionDto: FindAllSubscriptionDto,
  ): Promise<PaginationResponseDto<FindAllSubscriptionResponseDto>> {
    const { page, limit } = findAllSubscriptionDto;
    const queryBuilder =
      this.subscriptionsRepository.createQueryBuilder('subscription');
    queryBuilder.orderBy('subscription.createdAt', 'DESC');
    const subscriptionList = await paginateQueryBuilder(queryBuilder, {
      page,
      limit,
    });
    const personIds = subscriptionList.data.map(
      (subscription) => subscription.personId,
    );
    const personsData =
      await this.adminPersonsService.findMultipleSubscriptionPersonData(
        personIds,
      );
    const personsMap = new Map(
      personsData.map((person) => [person.personId, person]),
    );
    const subscriptionsWithPersonData = subscriptionList.data.map(
      (subscription) => {
        const person = personsMap.get(subscription.personId);
        return formatSubscriptionResponse(subscription, person);
      },
    );
    return {
      ...subscriptionList,
      data: subscriptionsWithPersonData,
    };
  }

  async validateUsersWithSubscription(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    return await this.documentUsersService.validateUserExcel(file);
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
