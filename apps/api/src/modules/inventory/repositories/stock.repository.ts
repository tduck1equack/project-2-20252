import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Stock, StockMovement, Prisma, MovementType, MovementStatus } from '@repo/database';

export interface CreateMovementItemData {
    productVariantId: string;
    quantity: number;
    batchId?: string | null;
}

export interface CreateMovementData {
    type: MovementType;
    status: MovementStatus;
    code?: string;
    reference?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    tenantId: string;
    createdById: string;
    items: CreateMovementItemData[];
}

export interface StockRepository {
    findByVariantAndWarehouse(variantId: string, warehouseId: string, batchId: string | null, tx?: Prisma.TransactionClient): Promise<Stock | null>;
    create(data: { warehouseId: string, productVariantId: string, quantity: number, tenantId?: string, batchId?: string | null }, tx?: Prisma.TransactionClient): Promise<Stock>;
    updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient): Promise<Stock>;
    createMovement(data: CreateMovementData, tx?: Prisma.TransactionClient): Promise<StockMovement>;
}

@Injectable()
export class PrismaStockRepository implements StockRepository {
    constructor(private prisma: PrismaService) { }

    private getClient(tx?: Prisma.TransactionClient) {
        return tx || this.prisma;
    }

    async findByVariantAndWarehouse(variantId: string, warehouseId: string, batchId: string | null = null, tx?: Prisma.TransactionClient): Promise<Stock | null> {
        return this.getClient(tx).stock.findFirst({
            where: {
                warehouseId,
                productVariantId: variantId,
                batchId: batchId
            }
        });
    }

    async create(data: { warehouseId: string, productVariantId: string, quantity: number, batchId?: string | null }, tx?: Prisma.TransactionClient): Promise<Stock> {
        return this.getClient(tx).stock.create({
            data: {
                warehouseId: data.warehouseId,
                productVariantId: data.productVariantId,
                quantity: data.quantity,
                batchId: data.batchId ?? null
            }
        });
    }

    async updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient): Promise<Stock> {
        return this.getClient(tx).stock.update({
            where: { id },
            data: { quantity }
        });
    }

    async createMovement(data: CreateMovementData, tx?: Prisma.TransactionClient): Promise<StockMovement> {
        return this.getClient(tx).stockMovement.create({
            data: {
                code: data.code || `MOV-${Date.now()}`,
                type: data.type,
                status: data.status,
                reference: data.reference,
                fromWarehouseId: data.fromWarehouseId,
                toWarehouseId: data.toWarehouseId,
                tenantId: data.tenantId,
                createdById: data.createdById,
                items: {
                    create: data.items.map(item => ({
                        productVariantId: item.productVariantId,
                        quantity: item.quantity,
                        batchId: item.batchId
                    }))
                }
            },
            include: { items: true }
        });
    }
}
