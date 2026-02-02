import { Injectable, Inject } from '@nestjs/common';
import type { PaymentProvider } from './interfaces/payment-provider.interface';

@Injectable()
export class PaymentService {
    constructor(
        @Inject('PAYMENT_PROVIDER') private readonly paymentProvider: PaymentProvider
    ) { }

    async createPaymentUrl(order: any, ipAddr: string) {
        return this.paymentProvider.createPaymentUrl(order, ipAddr);
    }

    async verifyReturn(query: any) {
        return this.paymentProvider.verifyReturnUrl(query);
    }
}
