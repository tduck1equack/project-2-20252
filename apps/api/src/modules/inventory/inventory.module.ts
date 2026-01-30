import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';
import { WarehouseController } from './warehouses/warehouse.controller';
import { WarehouseService } from './warehouses/warehouse.service';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { StockMovementController } from './movements/movement.controller';
import { MovementService } from './movements/movement.service';

import { PrismaProductRepository } from './repositories/product.repository';

import { PrismaStockRepository } from './repositories/stock.repository';
import { CreateStockMovementUseCase } from './use-cases/create-stock-movement.use-case';
import { InventoryGateway } from './gateways/inventory.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        InfrastructureModule,
        AuthModule // For WsAuthGuard
    ],
    controllers: [
        ProductController,
        WarehouseController,
        StockController,
        StockMovementController
    ],
    providers: [
        ProductService,
        WarehouseService,
        StockService,
        MovementService,
        CreateStockMovementUseCase,
        InventoryGateway, // WebSocket Gateway
        {
            provide: 'ProductRepository',
            useClass: PrismaProductRepository
        },
        {
            provide: 'StockRepository',
            useClass: PrismaStockRepository
        }
    ],
    exports: [
        ProductService,
        StockService
    ]
})
export class InventoryModule { }
