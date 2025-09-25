import { Module } from '@nestjs/common';
import { SubscriptionsTypeService } from './services/subscriptions-type.service';
import { SubscriptionsTypeCoreService } from './services/subscriptions-type-core.service';
import { SubscriptionsTypeValidateService } from './services/subscriptions-type-validate.service';
import { SubscriptionsTypeCustomService } from './services/subscriptions-type-custom.service';
import { SubscriptionsTypeController } from './subscriptions-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsType } from './entities/subscriptions-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsType])],
  controllers: [SubscriptionsTypeController],
  providers: [
    SubscriptionsTypeService,
    SubscriptionsTypeCoreService,
    SubscriptionsTypeValidateService,
    SubscriptionsTypeCustomService,
  ],
  exports: [SubscriptionsTypeService, SubscriptionsTypeValidateService],
})
export class SubscriptionsTypeModule {}
