import { PaymentProvider, PaymentResult } from '../interfaces/payment-provider.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
    private readonly logger = new Logger(MockPaymentProvider.name);

    async createPaymentUrl(order: any, ipAddr: string): Promise<string> {
        this.logger.log(`Creating Mock Payment URL for Order ${order.code}`);
        // Return a reliable internal URL that mimics a gateway return
        // We'll point to our own API return endpoint with success query params
        return `http://localhost:3000/checkout/success?vnp_ResponseCode=00&vnp_TxnRef=${order.code}`;
    }

    async verifyReturnUrl(query: any): Promise<PaymentResult> {
        this.logger.log('Verifying Mock Return URL');
        return {
            success: query.vnp_ResponseCode === '00',
            orderCode: query.vnp_TxnRef,
            transactionId: 'MOCK-' + Date.now(),
        };
    }
}
