import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { JournalController } from './controllers/journal.controller';
import { JournalService } from './services/journal.service';
import { AccountRepository } from './repositories/account.repository';
import { JournalRepository } from './repositories/journal.repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule], // For PrismaService
  controllers: [AccountController, JournalController],
  providers: [
    // Repositories
    AccountRepository,
    JournalRepository,
    // Services
    AccountService,
    JournalService,
  ],
  exports: [
    AccountService,
    JournalService,
    AccountRepository,
    JournalRepository,
  ],
})
export class AccountingModule {}
