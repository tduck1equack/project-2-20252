import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CatalogModule } from './modules/catalog/catalog.module';

@Module({
  imports: [AuthModule, InventoryModule, CatalogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
