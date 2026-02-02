import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { OrderCreatedEvent } from '../sales/events/order-created.event';

@Injectable()
export class NotificationListener {
    constructor(@InjectQueue('notifications') private notificationQueue: Queue) { }

    @OnEvent('order.created')
    async handleOrderCreatedEvent(event: OrderCreatedEvent) {
        console.log('Received Event: order.created', event);

        // Job 1: Send Email
        await this.notificationQueue.add('send_order_email', {
            email: event.customerEmail,
            orderCode: event.orderCode,
            total: event.totalAmount,
        });

        // Job 2: Notify Admin Dashboard via Socket
        await this.notificationQueue.add('notify_new_order', {
            orderCode: event.orderCode,
            total: event.totalAmount,
        });
    }
}
