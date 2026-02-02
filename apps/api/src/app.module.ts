import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { EInvoiceModule } from './modules/einvoice/einvoice.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { SharedModule } from './modules/shared/shared.module';
import { SalesModule } from './modules/sales/sales.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    InfrastructureModule, // Global Infrastructure (Prisma, Redis)
    SharedModule, // Global Utilities & Logger
    AuthModule,
    InventoryModule,
    CatalogModule,
    AccountingModule,
    EInvoiceModule,
    SalesModule,
    ReportsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
