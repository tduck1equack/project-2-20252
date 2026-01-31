import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { GetOrdersUseCase } from './use-cases/get-orders.use-case';
import { UpdateOrderStatusUseCase } from './use-cases/update-order-status.use-case';
import { OrderRepository } from './repositories/order.repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { InventoryModule } from '../inventory/inventory.module';
import { EInvoiceModule } from '../einvoice/einvoice.module';

@Module({
    imports: [
        InfrastructureModule,
        InventoryModule,
        EInvoiceModule
    ],
    controllers: [SalesController],
    providers: [
        // Repositories
        OrderRepository,
        // Use Cases
        CreateOrderUseCase,
        GetOrdersUseCase,
        UpdateOrderStatusUseCase
    ],
    exports: [OrderRepository]
})
export class SalesModule { }
