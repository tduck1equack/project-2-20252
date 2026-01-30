import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/database';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';
import { WarehouseController } from './warehouses/warehouse.controller';
import { WarehouseService } from './warehouses/warehouse.service';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { StockMovementController } from './movements/movement.controller';
import { MovementService } from './movements/movement.service';

@Module({
    imports: [PrismaModule],
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
        MovementService
    ],
    exports: [
        ProductService,
        StockService
    ]
})
export class InventoryModule { }
