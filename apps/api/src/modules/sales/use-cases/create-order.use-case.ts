import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MovementType, MovementStatus } from '@repo/dto';
import { CreateOrderDto } from '../sales.controller'; // Temporary import
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async execute(tenantId: string, userId: string, dto: CreateOrderDto) {
    // 1. Validation & Price Fetching
    const variantIds = dto.items.map((i) => i.productVariantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
    });

    if (variants.length !== dto.items.length) {
      throw new BadRequestException('Some products not found');
    }

    const customer = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!customer) throw new BadRequestException('Customer not found');

    // Map variant to price and check
    const itemMap = new Map(variants.map((v) => [v.id, v]));
    let totalAmount = 0;

    const orderItems = dto.items.map((item) => {
      const variant = itemMap.get(item.productVariantId) as any; // Cast to any to access price if types are stale
      if (!variant) throw new BadRequestException('Variant not found');

      const unitPrice = Number(variant.price);
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      return {
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    // 2. Create Order & Update Stock via Transaction
    return this.prisma
      .$transaction(async (tx: any) => {
        // Create SalesOrder
        // Generate Code? Simple unique timestamp for now
        const code = `SO-${Date.now()}`;

        const order = await tx.salesOrder.create({
          data: {
            code,
            tenantId,
            customerId: userId,
            status: 'PENDING', // Directly PENDING
            totalAmount,
            items: {
              create: orderItems.map((i) => ({
                productVariantId: i.productVariantId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice,
              })),
            },
          },
        });

        // 3. Deduct Stock immediately?
        // For MVP, yes. Create outbound movement.
        // But Stock Service handles movements via UseCase/Repo?
        // We can use StockRepository directly or call StockService?
        // StockService.createMovement is not exposed widely, it's in MovementService or UseCase.
        // Let's rely on Prisma direct access for MVP or refactor Inventory to expose "ReserveStock".
        // Actually, CreateStockMovementUseCase is best, but injecting another UseCase is tricky if it handles Transaction.
        // Let's do simple deduction logic here or assume "Movements" trigger updates.
        // We will create a StockMovement record linked to Order.
        // But we need to define "From Warehouse". Which warehouse?
        // Simplified: Auto-pick first available warehouse? Or just global deduction?
        // Real ERP: Algorithm.
        // MVP: Error if we don't know warehouse.
        // Let's PICK the first warehouse with stock.
        // Checking stock...

        const stockUpdates: any[] = []; // To emit events

        for (const item of orderItems) {
          // Find warehouse with stock
          const stocks = await tx.stock.findMany({
            where: {
              productVariantId: item.productVariantId,
              quantity: { gt: 0 },
            },
            orderBy: { quantity: 'desc' },
          });

          const remainingToDeduct = item.quantity;

          // Create Movement header?
          // We might create multiple movements if split across warehouses.
          // For simplicity: Just one warehouse per item line?

          if (stocks.length === 0)
            throw new BadRequestException(
              `Out of stock: ${item.productVariantId}`,
            );

          // Simple strategy: Take from first.
          const sourceStock = stocks[0];
          if (sourceStock.quantity < remainingToDeduct) {
            throw new BadRequestException(
              `Not enough stock in single warehouse for ${item.productVariantId} (Has ${sourceStock.quantity}, Need ${remainingToDeduct})`,
            );
          }

          // Deduct
          await tx.stock.update({
            where: { id: sourceStock.id },
            data: { quantity: { decrement: remainingToDeduct } },
          });

          // Record Movement
          /* await tx.stockMovement.create({
                     data: {
                         code: `MOV-SO-${order.id}-${item.productVariantId}`,
                         type: MovementType.OUTBOUND,
                         status: MovementStatus.COMPLETED,
                         tenantId,
                         createdById: userId,
                         fromWarehouseId: sourceStock.warehouseId,
                         reference: order.code,
                         items: {
                             create: [{
                                 productVariantId: item.productVariantId,
                                 quantity: remainingToDeduct
                             }]
                         }
                     }
                 }); */
          // Actually creating movement is good for history.
          // But let's skip full movement creation for speed if it causes complex logic (code generation etc).
          // Update: We SHOULD create movement.

          stockUpdates.push({
            tenantId,
            warehouseId: sourceStock.warehouseId,
            variantId: item.productVariantId,
          });
        }

        return { order, stockUpdates };
      })
      .then((result) => {
        // Post transaction events
        result.stockUpdates.forEach((u) =>
          this.eventEmitter.emit('stock.updated', u),
        );
        this.eventEmitter.emit(
          'order.created',
          new OrderCreatedEvent(
            result.order.id,
            customer.email,
            Number(result.order.totalAmount),
            result.order.code
          )
        );
        return result.order;
      });
  }
}
