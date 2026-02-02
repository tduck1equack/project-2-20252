import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    async sendOrderConfirmation(to: string, orderCode: string, total: number) {
        // Mock Implementation
        this.logger.log(`📧 Sending Order Confirmation to [${to}] for Order [${orderCode}] with Total [${total}]`);
        // In real impl: await resend.emails.send(...)
        return Promise.resolve(true);
    }
}
