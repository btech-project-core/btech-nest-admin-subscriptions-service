import { Module } from '@nestjs/common';
import { AdminPersonsService } from './services/admin-persons.service';
import { TransactionService } from './services/transaction.service';

@Module({
  providers: [AdminPersonsService, TransactionService],
  exports: [AdminPersonsService, TransactionService],
})
export class CommonModule {}
