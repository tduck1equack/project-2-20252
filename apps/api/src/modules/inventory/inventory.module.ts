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

@Module({
    imports: [InfrastructureModule],
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
