import { Module } from '@nestjs/common';
import { AdminPersonsService } from './services/admin-persons.service';
import { TransactionService } from './services/transaction.service';
import { DocumentUsersService } from './services/document-users.service';

@Module({
  providers: [AdminPersonsService, TransactionService, DocumentUsersService],
  exports: [AdminPersonsService, TransactionService, DocumentUsersService],
})
export class CommonModule {}
