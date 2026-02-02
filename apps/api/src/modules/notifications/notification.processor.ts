import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { EmailService } from './email.service';
import { NotificationGateway } from './notification.gateway';
import { Logger } from '@nestjs/common';

@Processor('notifications')
export class NotificationProcessor {
    private readonly logger = new Logger(NotificationProcessor.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly notificationGateway: NotificationGateway,
    ) { }

    @Process('send_order_email')
    async handleSendOrderEmail(job: Job<{ email: string; orderCode: string; total: number }>) {
        this.logger.log(`Processing Job: send_order_email for ${job.data.orderCode}`);
        await this.emailService.sendOrderConfirmation(job.data.email, job.data.orderCode, job.data.total);
    }

    @Process('notify_new_order')
    async handleNotifyNewOrder(job: Job<{ orderCode: string; total: number }>) {
        this.logger.log(`Processing Job: notify_new_order for ${job.data.orderCode}`);
        this.notificationGateway.emitNewOrder({
            message: `New Order ${job.data.orderCode} received!`,
            total: job.data.total
        });
    }
}
