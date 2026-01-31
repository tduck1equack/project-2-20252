import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { EInvoiceService } from '../../einvoice/services/einvoice.service';
import { OrderStatus } from '@repo/database';

@Injectable()
export class UpdateOrderStatusUseCase {
    constructor(
        private prisma: PrismaService,
        private invoiceService: EInvoiceService
    ) { }

    async execute(tenantId: string, orderId: string, newStatus: OrderStatus) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id: orderId },
            include: { items: { include: { productVariant: true } }, customer: true }
        });

        if (!order || order.tenantId !== tenantId) {
            throw new NotFoundException('Order not found');
        }

        // Validate transitions
        const current = order.status;
        if (current === OrderStatus.SHIPPED || current === OrderStatus.CANCELLED) {
            throw new BadRequestException(`Cannot update order in ${current} status`);
        }

        const updated = await this.prisma.salesOrder.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        // Trigger Invoice if SHIPPED (Completed)
        if (newStatus === OrderStatus.SHIPPED) {
            try {
                await this.invoiceService.publishInvoice(tenantId, {
                    transactionRef: order.code,
                    taxCode: '',
                    customerName: order.customer?.name || 'Customer',
                    customerAddress: '',
                    totalAmount: Number(order.totalAmount),
                    vatAmount: 0,
                    items: order.items.map(i => ({
                        name: i.productVariant.name,
                        unit: 'pcs',
                        quantity: i.quantity,
                        price: Number(i.unitPrice),
                        amount: Number(i.totalPrice),
                        vatRate: 0
                    }))
                });
            } catch (e) {
                console.error('Invoice generation failed', e);
            }
        }

        return updated;
    }
}
