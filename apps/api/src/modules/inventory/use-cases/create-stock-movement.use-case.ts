import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  CreateStockMovementDto,
  MovementType,
  MovementStatus,
} from '@repo/dto';
import type { StockRepository } from '../repositories/stock.repository';
import { CreateMovementData } from '../repositories/stock.repository'; // Value import
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CreateStockMovementUseCase {
  constructor(
    @Inject('StockRepository') private stockRepo: StockRepository,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(tenantId: string, userId: string, dto: CreateStockMovementDto) {
    // Collect updates to emit later
    const updates: {
      tenantId: string;
      warehouseId: string;
      variantId: string;
    }[] = [];

    const movement = await this.prisma.$transaction(async (tx) => {
      const movementData: CreateMovementData = {
        type: dto.type,
        status: MovementStatus.COMPLETED,
        reference: dto.reference,
        fromWarehouseId: dto.fromWarehouseId,
        toWarehouseId: dto.toWarehouseId,
        tenantId,
        createdById: userId,
        items: dto.items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          batchId: item.batchCode,
        })),
      };

      const createdMovement = await this.stockRepo.createMovement(
        movementData,
        tx,
      );

      for (const item of movementData.items) {
        if (
          dto.type === MovementType.OUTBOUND ||
          dto.type === MovementType.TRANSFER
        ) {
          if (!dto.fromWarehouseId)
            throw new BadRequestException('From Warehouse required');
          await this.adjustStock(
            dto.fromWarehouseId,
            item.productVariantId,
            -item.quantity,
            item.batchId,
            tx,
          );
          updates.push({
            tenantId,
            warehouseId: dto.fromWarehouseId,
            variantId: item.productVariantId,
          });
        }

        if (
          dto.type === MovementType.INBOUND ||
          dto.type === MovementType.TRANSFER
        ) {
          if (!dto.toWarehouseId)
            throw new BadRequestException('To Warehouse required');
          await this.adjustStock(
            dto.toWarehouseId,
            item.productVariantId,
            item.quantity,
            item.batchId,
            tx,
          );
          updates.push({
            tenantId,
            warehouseId: dto.toWarehouseId,
            variantId: item.productVariantId,
          });
        }
      }
      return createdMovement;
    });

    // Emit events after transaction commit
    for (const update of updates) {
      this.eventEmitter.emit('stock.updated', update);
    }

    return movement;
  }

  private async adjustStock(
    warehouseId: string,
    variantId: string,
    delta: number,
    batchId: string | undefined | null,
    tx: any,
  ) {
    const bId = batchId || null;
    let stock = await this.stockRepo.findByVariantAndWarehouse(
      variantId,
      warehouseId,
      bId,
      tx,
    );

    if (!stock) {
      if (delta < 0)
        throw new BadRequestException(
          `Insufficient stock for variant ${variantId}`,
        );
      stock = await this.stockRepo.create(
        {
          warehouseId,
          productVariantId: variantId,
          quantity: 0,
          batchId: bId,
        },
        tx,
      );
    }

    const newQuantity = stock.quantity + delta;
    if (newQuantity < 0)
      throw new BadRequestException(
        `Insufficient stock for variant ${variantId}`,
      );

    await this.stockRepo.updateQuantity(stock.id, newQuantity, tx);
  }
}
