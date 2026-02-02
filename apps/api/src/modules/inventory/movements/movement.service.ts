import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  CreateStockMovementDto,
  MovementType,
  MovementStatus,
  StockMovementDto,
} from '@repo/dto';

@Injectable()
export class MovementService {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    userId: string,
    dto: CreateStockMovementDto,
  ): Promise<StockMovementDto> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validation
      const { type, fromWarehouseId, toWarehouseId, items, reference } = dto;

      if (type === MovementType.INBOUND && !toWarehouseId) {
        throw new BadRequestException(
          'Inbound movement requires toWarehouseId',
        );
      }
      if (type === MovementType.OUTBOUND && !fromWarehouseId) {
        throw new BadRequestException(
          'Outbound movement requires fromWarehouseId',
        );
      }
      if (
        type === MovementType.TRANSFER &&
        (!fromWarehouseId || !toWarehouseId)
      ) {
        throw new BadRequestException(
          'Transfer movement requires fromWarehouseId and toWarehouseId',
        );
      }

      // 2. Create Movement Header
      const movement = await tx.stockMovement.create({
        data: {
          code: `MOV-${Date.now()}`, // Simple generation
          type: type as any, // Cast to Prisma Enum
          status: MovementStatus.COMPLETED as any, // Auto-complete for now
          date: new Date(),
          reference,
          fromWarehouseId,
          toWarehouseId,
          tenantId,
          createdById: userId,
        },
      });

      // 3. Process Items
      for (const item of items) {
        // Handle Batch
        let batchId: string | null = null;
        if (item.batchCode) {
          const batch = await tx.batch.findUnique({
            where: {
              code_productVariantId: {
                code: item.batchCode,
                productVariantId: item.productVariantId,
              },
            },
          });

          if (batch) {
            batchId = batch.id;
          } else if (type === MovementType.INBOUND) {
            // Only create batch on INBOUND
            const newBatch = await tx.batch.create({
              data: {
                code: item.batchCode,
                productVariantId: item.productVariantId,
              },
            });
            batchId = newBatch.id;
          } else {
            throw new BadRequestException(
              `Batch ${item.batchCode} not found for product`,
            );
          }
        }

        // Create Movement Item
        await tx.stockMovementItem.create({
          data: {
            movementId: movement.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            batchId,
          },
        });

        // Update Stock
        if (type === MovementType.INBOUND) {
          await this.increaseStock(
            tx,
            toWarehouseId!,
            item.productVariantId,
            batchId,
            item.quantity,
          );
        } else if (type === MovementType.OUTBOUND) {
          await this.decreaseStock(
            tx,
            fromWarehouseId!,
            item.productVariantId,
            batchId,
            item.quantity,
          );
        } else if (type === MovementType.TRANSFER) {
          await this.decreaseStock(
            tx,
            fromWarehouseId!,
            item.productVariantId,
            batchId,
            item.quantity,
          );
          await this.increaseStock(
            tx,
            toWarehouseId!,
            item.productVariantId,
            batchId,
            item.quantity,
          );
        }
      }

      return movement as any;
    });
  }

  private async increaseStock(
    tx: any,
    warehouseId: string,
    variantId: string,
    batchId: string | null,
    infoQty: number,
  ) {
    // Find existing stock or create
    // Upsert requires unique key. We have [warehouseId, productVariantId, batchId]
    // But Prisma upsert needs `where` using @@unique.
    // If batchId is null, unique key is { warehouseId, productVariantId, batchId: null }?
    // Prisma handling of null in composite unique depends on DB.
    // Postgres supports it if NULLs NOT DISTINCT or using unique index with nulls.
    // Our schema: @@unique([warehouseId, productVariantId, batchId]).
    // If batchId can be null, we must handle it.

    // Let's Find First explicitly to be safe
    const existing = await tx.stock.findFirst({
      where: {
        warehouseId,
        productVariantId: variantId,
        batchId: batchId || null,
      },
    });

    if (existing) {
      await tx.stock.update({
        where: { id: existing.id },
        data: { quantity: { increment: infoQty } },
      });
    } else {
      await tx.stock.create({
        data: {
          warehouseId,
          productVariantId: variantId,
          batchId,
          quantity: infoQty,
        },
      });
    }
  }

  private async decreaseStock(
    tx: any,
    warehouseId: string,
    variantId: string,
    batchId: string | null,
    infoQty: number,
  ) {
    const existing = await tx.stock.findFirst({
      where: {
        warehouseId,
        productVariantId: variantId,
        batchId: batchId || null,
      },
    });

    if (!existing || existing.quantity < infoQty) {
      throw new BadRequestException(
        `Insufficient stock for variant ${variantId} at warehouse ${warehouseId}`,
      );
    }

    await tx.stock.update({
      where: { id: existing.id },
      data: { quantity: { decrement: infoQty } },
    });
  }

  async findAll(tenantId: string): Promise<StockMovementDto[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { tenantId },
      include: { items: true },
      orderBy: { date: 'desc' },
    });
    return movements as any;
  }
}
