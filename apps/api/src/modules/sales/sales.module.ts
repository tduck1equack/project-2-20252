import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [
        InfrastructureModule,
        InventoryModule
    ],
    controllers: [SalesController],
    providers: [
        CreateOrderUseCase
    ],
})
export class SalesModule { }
