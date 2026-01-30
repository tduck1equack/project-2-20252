import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { JournalService } from '../../accounting/services/journal.service';
import { MovementType, MovementStatus, StockMovement, Prisma } from '@repo/database';

interface CreateMovementDto {
    type: MovementType;
    date?: Date;
    reference?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    items: {
        productVariantId: string;
        quantity: number;
        batchId?: string;
    }[];
}

@Injectable()
export class StockMovementService {
    constructor(
        private prisma: PrismaService,
        private journalService: JournalService
    ) { }

    async create(tenantId: string, createdById: string, data: CreateMovementDto) {
        if (data.type === 'TRANSFER' && (!data.fromWarehouseId || !data.toWarehouseId)) {
            throw new BadRequestException('Transfer requires both fromWarehouseId and toWarehouseId');
        }
        if (data.type === 'INBOUND' && !data.toWarehouseId) {
            throw new BadRequestException('Inbound requires toWarehouseId');
        }
        if (data.type === 'OUTBOUND' && !data.fromWarehouseId) {
            throw new BadRequestException('Outbound requires fromWarehouseId');
        }

        // Generate code (mock implementation, ideally sequential)
        const code = `MOV-${Date.now()}`;

        // Transaction: Create Movement + Create Items + Update Stock
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Header
            const movement = await tx.stockMovement.create({
                data: {
                    code,
                    type: data.type,
                    status: MovementStatus.COMPLETED, // Auto-complete for now
                    date: data.date || new Date(),
                    reference: data.reference,
                    fromWarehouseId: data.fromWarehouseId,
                    toWarehouseId: data.toWarehouseId,
                    tenantId,
                    createdById,
                    items: {
                        create: data.items.map(item => ({
                            productVariantId: item.productVariantId,
                            quantity: item.quantity,
                            batchId: item.batchId,
                        })),
                    },
                },
                include: { items: true },
            });

            // 2. Update Stock Levels based on Type
            for (const item of data.items) {
                if (data.type === 'INBOUND' && data.toWarehouseId) {
                    await this.adjustStock(tx, data.toWarehouseId, item.productVariantId, item.quantity, item.batchId);
                } else if (data.type === 'OUTBOUND' && data.fromWarehouseId) {
                    await this.adjustStock(tx, data.fromWarehouseId, item.productVariantId, -item.quantity, item.batchId);
                } else if (data.type === 'TRANSFER' && data.fromWarehouseId && data.toWarehouseId) {
                    await this.adjustStock(tx, data.fromWarehouseId, item.productVariantId, -item.quantity, item.batchId);
                    await this.adjustStock(tx, data.toWarehouseId, item.productVariantId, item.quantity, item.batchId);
                }
            }

            // 3. Automated Accounting Posting (Phase 3 Requirement)
            // Mock Logic: 
            // INBOUND = Debit Inventory (152), Credit Payable (331). Value = qty * 100,000 (mock cost)
            // OUTBOUND = Debit COGS (632), Credit Inventory (152).

            // Note: In a real system, we'd fetch product cost (FIFO/AVCO)

            const totalValue = data.items.reduce((sum, item) => sum + (item.quantity * 100000), 0);

            if (totalValue > 0) {
                // Find Accounts (Ideally these IDs come from configuration/constants)
                // For MVP, we fetch by Code. 
                // Optimization: Cache these lookups.

                const inventoryAccount = await tx.account.findFirst({ where: { code: '152', tenantId } });
                const payableAccount = await tx.account.findFirst({ where: { code: '331', tenantId } });
                const cogsAccount = await tx.account.findFirst({ where: { code: '632', tenantId } });

                if (data.type === 'INBOUND' && inventoryAccount && payableAccount) {
                    await this.journalService.createWithTransaction(tx, tenantId, createdById, {
                        date: data.date || new Date(),
                        reference: code,
                        description: `Auto-generated from Inbound ${code}`,
                        lines: [
                            { accountId: inventoryAccount.id, debit: totalValue, credit: 0, description: 'Inventory Increase' },
                            { accountId: payableAccount.id, debit: 0, credit: totalValue, description: 'Payable Increase' }
                        ]
                    });
                } else if (data.type === 'OUTBOUND' && inventoryAccount && cogsAccount) {
                    await this.journalService.createWithTransaction(tx, tenantId, createdById, {
                        date: data.date || new Date(),
                        reference: code,
                        description: `Auto-generated from Outbound ${code}`,
                        lines: [
                            { accountId: cogsAccount.id, debit: totalValue, credit: 0, description: 'COGS' },
                            { accountId: inventoryAccount.id, debit: 0, credit: totalValue, description: 'Inventory Decrease' }
                        ]
                    });
                }
            }

            return movement;
        });
    }

    private async adjustStock(tx: Prisma.TransactionClient, warehouseId: string, productVariantId: string, quantity: number, batchId?: string) {
        const stock = await tx.stock.findFirst({
            where: {
                warehouseId,
                productVariantId,
                batchId: batchId || null
            },
        });

        if (stock) {
            if (stock.quantity + quantity < 0) {
                throw new BadRequestException(`Insufficient stock for variant ${productVariantId} (Batch: ${batchId || 'N/A'}) in warehouse ${warehouseId}`);
            }
            await tx.stock.update({
                where: { id: stock.id },
                data: { quantity: stock.quantity + quantity },
            });
        } else {
            if (quantity < 0) {
                throw new BadRequestException(`Insufficient stock (not found) for variant ${productVariantId} (Batch: ${batchId || 'N/A'}) in warehouse ${warehouseId}`);
            }
            await tx.stock.create({
                data: {
                    warehouseId,
                    productVariantId,
                    quantity,
                    batchId: batchId ?? null,
                },
            });
        }
    }

    async findAll(tenantId: string) {
        return this.prisma.stockMovement.findMany({
            where: { tenantId },
            include: {
                fromWarehouse: true,
                toWarehouse: true,
                items: { include: { productVariant: true } },
                createdBy: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
