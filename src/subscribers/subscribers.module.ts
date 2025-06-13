import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { SubscriberRole } from './entities/subscriber-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber, SubscriberRole])],
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}
