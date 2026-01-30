import { Module } from '@nestjs/common';
import { WarehouseController } from './controllers/warehouse.controller';
import { WarehouseService } from './services/warehouse.service';
import { StockMovementController } from './controllers/stock-movement.controller';
import { StockMovementService } from './services/stock-movement.service';
import { PrismaService } from '../../providers/prisma.service';

@Module({
    controllers: [WarehouseController, StockMovementController],
    providers: [WarehouseService, StockMovementService, PrismaService],
    exports: [WarehouseService, StockMovementService],
})
export class InventoryModule { }
