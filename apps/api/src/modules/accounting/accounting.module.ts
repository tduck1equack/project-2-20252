import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { JournalController } from './controllers/journal.controller';
import { JournalService } from './services/journal.service';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Module({
    controllers: [AccountController, JournalController],
    providers: [AccountService, JournalService, PrismaService],
    exports: [AccountService, JournalService],
})
export class AccountingModule { }
