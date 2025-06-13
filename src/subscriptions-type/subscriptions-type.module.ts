import { Module } from '@nestjs/common';
import { SubscriptionsTypeService } from './subscriptions-type.service';
import { SubscriptionsTypeController } from './subscriptions-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsType } from './entities/subscriptions-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsType])],
  controllers: [SubscriptionsTypeController],
  providers: [SubscriptionsTypeService],
})
export class SubscriptionsTypeModule {}
