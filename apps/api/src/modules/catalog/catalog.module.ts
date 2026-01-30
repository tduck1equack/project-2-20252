import { Module } from '@nestjs/common';
import { UomController } from './controllers/uom.controller';
import { UomService } from './services/uom.service';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { BatchController } from './controllers/batch.controller';
import { BatchService } from './services/batch.service';
import { PrismaService } from '../../providers/prisma.service';

@Module({
    controllers: [UomController, ProductController, BatchController],
    providers: [UomService, ProductService, BatchService, PrismaService],
    exports: [UomService, ProductService, BatchService],
})
export class CatalogModule { }
