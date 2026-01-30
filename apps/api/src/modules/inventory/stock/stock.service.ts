import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { StockLevelDto } from '@repo/dto';

@Injectable()
export class StockService {
    constructor(private prisma: PrismaService) { }

    async getStocks(tenantId: string, warehouseId?: string, search?: string): Promise<StockLevelDto[]> {
        const where: any = {
            warehouse: { tenantId }
        };

        if (warehouseId) {
            where.warehouseId = warehouseId;
        }

        if (search) {
            where.productVariant = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                    { product: { name: { contains: search, mode: 'insensitive' } } }
                ]
            };
        }

        const stocks = await this.prisma.stock.findMany({
            where,
            include: {
                productVariant: {
                    include: { product: true }
                },
                warehouse: true
            }
        });

        // Map to flat DTO
        return stocks.map(stock => ({
            warehouseId: stock.warehouseId,
            productVariantId: stock.productVariantId,
            productName: stock.productVariant.product.name,
            variantName: stock.productVariant.name,
            sku: stock.productVariant.sku,
            quantity: stock.quantity
        }));
    }
}
