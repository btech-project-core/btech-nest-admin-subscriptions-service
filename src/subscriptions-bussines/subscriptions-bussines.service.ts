import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from './dto/create-subscriptions-bussine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';

@Injectable()
export class SubscriptionsBussinesService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}
  async create(
    createSubscriptionsBussineDto: CreateSubscriptionsBussineDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(SubscriptionsBussine)
      : this.subscriptionsBussinesRepository;
    const subscriptionsBussines = repository.create(
      createSubscriptionsBussineDto,
    );
    await repository.save(subscriptionsBussines);
    return subscriptionsBussines;
  }
}
