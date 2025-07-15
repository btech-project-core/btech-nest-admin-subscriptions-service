import { Module } from '@nestjs/common';
import { AdminPersonsService } from './services/admin-persons.service';

@Module({
  providers: [AdminPersonsService],
  exports: [AdminPersonsService],
})
export class CommonModule {}
