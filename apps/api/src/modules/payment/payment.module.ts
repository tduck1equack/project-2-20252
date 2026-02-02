import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MockPaymentProvider } from './providers/mock-payment.provider';
import { VNPayProvider } from './providers/vnpay.provider';

@Module({
    controllers: [PaymentController],
    providers: [
        PaymentService,
        {
            provide: 'PAYMENT_PROVIDER',
            // Switch here for Dev vs Prod. For now, use Mock.
            useClass: process.env.NODE_ENV === 'production' ? VNPayProvider : MockPaymentProvider
        }
    ],
    exports: [PaymentService],
})
export class PaymentModule { }
