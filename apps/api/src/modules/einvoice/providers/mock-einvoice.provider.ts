import { Injectable, Logger } from '@nestjs/common';
import { EInvoiceProvider, InvoiceData, PublishResult } from '../interfaces/einvoice-provider.interface';

@Injectable()
export class MockInvoiceProvider implements EInvoiceProvider {
    readonly providerCode = 'MOCK';
    private readonly logger = new Logger(MockInvoiceProvider.name);

    async publish(invoice: InvoiceData): Promise<PublishResult> {
        this.logger.log(`[MockProvider] Publishing Invoice ${invoice.transactionRef} for ${invoice.customerName}`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate Validation: Fail if customerName is "FAIL"
        if (invoice.customerName === 'FAIL') {
            this.logger.warn(`[MockProvider] Simulation Failure triggered for ${invoice.transactionRef}`);
            return {
                success: false,
                errorMessage: 'Simulated Provider Error: Invalid Customer Name',
                rawResponse: { error: 'mock_error_001' }
            };
        }

        // Simulate Success
        const mockSerial = 'C24TAA';
        const mockNo = Math.floor(Math.random() * 10000).toString().padStart(7, '0');
        const mockId = `MOCK-${Date.now()}`;

        this.logger.log(`[MockProvider] Successfully Published: ${mockSerial}/${mockNo}`);

        return {
            success: true,
            externalId: mockId,
            externalSerial: mockSerial,
            externalNo: mockNo,
            externalUrl: `https://mock-einvoice.local/view/${mockId}`,
            rawResponse: { status: 'OK', ts: Date.now() }
        };
    }

    async checkStatus(externalId: string): Promise<PublishResult> {
        return {
            success: true,
            externalId,
            rawResponse: { status: 'PUBLISHED (MOCK)' }
        };
    }
}
