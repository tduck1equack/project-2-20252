import { Module } from '@nestjs/common';
import { EInvoiceController } from './controllers/einvoice.controller';
import { EInvoiceService } from './services/einvoice.service';
import { MockInvoiceProvider } from './providers/mock-einvoice.provider';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Module({
  controllers: [EInvoiceController],
  providers: [EInvoiceService, MockInvoiceProvider, PrismaService],
  exports: [EInvoiceService],
})
export class EInvoiceModule {}
