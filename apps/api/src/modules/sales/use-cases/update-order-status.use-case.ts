import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { EInvoiceService } from '../../einvoice/services/einvoice.service';
import { OrderStatus } from '@repo/database';

@Injectable()
export class UpdateOrderStatusUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private invoiceService: EInvoiceService
    ) { }

    async execute(tenantId: string, orderId: string, newStatus: OrderStatus) {
        const order = await this.orderRepository.findById(orderId, {
            items: { include: { productVariant: true } },
            customer: true
        });

        if (!order || order.tenantId !== tenantId) {
            throw new NotFoundException('Order not found');
        }

        // Validate transitions
        const current = order.status;
        if (current === OrderStatus.SHIPPED || current === OrderStatus.CANCELLED) {
            throw new BadRequestException(`Cannot update order in ${current} status`);
        }

        const updated = await this.orderRepository.updateStatus(orderId, newStatus);

        // Trigger Invoice if SHIPPED
        if (newStatus === OrderStatus.SHIPPED) {
            try {
                await this.invoiceService.publishInvoice(tenantId, {
                    transactionRef: order.code,
                    taxCode: '',
                    customerName: (order as any).customer?.name || 'Customer',
                    customerAddress: '',
                    totalAmount: Number(order.totalAmount),
                    vatAmount: 0,
                    items: (order as any).items.map((i: any) => ({
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
