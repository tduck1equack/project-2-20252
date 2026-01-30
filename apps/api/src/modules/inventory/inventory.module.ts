import { Module } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';
import { WarehouseController } from './warehouses/warehouse.controller';
import { WarehouseService } from './warehouses/warehouse.service';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { StockMovementController } from './movements/movement.controller';
import { MovementService } from './movements/movement.service';

@Module({
    imports: [],
    controllers: [
        ProductController,
        WarehouseController,
        StockController,
        StockMovementController
    ],
    providers: [
        PrismaService,
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
