import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { RpcException } from '@nestjs/microservices';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { formatSubscriptionBussineResponse } from '../helpers/format-subscription-response.helper';
import { FindSubscriptionMultiplePersonDataResponseDto } from 'src/common/dto/find-subscription-multiple-person-data.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { FindAllSubscriptionResponseDto } from '../dto/find-all-subscription.dto';

@Injectable()
export class SubscriptionsBulkService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async formatSubscriptionsBussineWithPersonData(
    subscriptionsBussineList: SubscriptionsBussine[],
    term?: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    const personIds = subscriptionsBussineList.map(
      (subscriptionBussine) => subscriptionBussine.personId,
    );

    let personsData: FindSubscriptionMultiplePersonDataResponseDto[] = [];
    if (personIds.length > 0) {
      personsData =
        await this.adminPersonsService.findMultipleSubscriptionPersonData({
          personIds,
        });
    }

    const personsMap = new Map(
      personsData.map((person) => [person.personId, person]),
    );

    const formattedData = subscriptionsBussineList
      .map((subscriptionBussine) => {
        const person = personsMap.get(subscriptionBussine.personId);
        return formatSubscriptionBussineResponse(
          subscriptionBussine,
          person,
          term,
        );
      })
      .filter((item) => item !== null);

    return formattedData;
  }

  async findOneWithCreateResponse(
    subscriptionId: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    const createdSubscription = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .where('subscription.subscriptionId = :subscriptionId', {
        subscriptionId,
      })
      .getOne();

    if (!createdSubscription)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'No se ha encontrado la suscripción',
      });

    const subscriptionsBussineList = (
      createdSubscription.subscriptionsBussine || []
    ).map((subscriptionBussine) => {
      subscriptionBussine.subscription = createdSubscription;
      return subscriptionBussine;
    });

    return await this.formatSubscriptionsBussineWithPersonData(
      subscriptionsBussineList,
    );
  }
}
