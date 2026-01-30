import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { EInvoiceModule } from './modules/einvoice/einvoice.module';
import { RedisModule } from './redis';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    InventoryModule,
    CatalogModule,
    AccountingModule,
    EInvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
