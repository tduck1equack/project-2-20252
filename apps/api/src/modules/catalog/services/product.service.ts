import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { Product, ProductVariant } from '@repo/database';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; sku: string; description?: string; uomId: string; tenantId: string; variants?: any[] }): Promise<Product> {
        const { variants, ...productData } = data;
        return this.prisma.product.create({
            data: {
                ...productData,
                variants: {
                    create: variants || [], // Create variants if provided
                },
            },
            include: { variants: true, uom: true },
        });
    }

    async findAll(tenantId: string): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: { tenantId },
            include: { variants: true, uom: true },
        });
    }

    async findOne(id: string, tenantId: string): Promise<Product | null> {
        return this.prisma.product.findFirst({
            where: { id, tenantId },
            include: { variants: true, uom: true },
        });
    }

    async update(id: string, tenantId: string, data: { name?: string; description?: string; uomId?: string }): Promise<any> {
        return this.prisma.product.updateMany({
            where: { id, tenantId },
            data,
        });
        // Note: updating variants is complex, handled separately or via specific endpoints usually
    }

    async remove(id: string, tenantId: string): Promise<any> {
        // Delete variants first or rely on cascade? Prisma doesn't cascade default on many-to-one without explicit setup
        // For now, let's assume we need to handle cleanup or let DB handle if configured
        return this.prisma.product.deleteMany({
            where: { id, tenantId },
        });
    }
}
