import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { EInvoiceProvider, InvoiceData } from '../interfaces/einvoice-provider.interface';
import { MockInvoiceProvider } from '../providers/mock-einvoice.provider';
import { EInvoiceStatus, Prisma } from '@repo/database';

@Injectable()
export class EInvoiceService {
    private providers: Map<string, EInvoiceProvider> = new Map();

    constructor(
        private prisma: PrismaService,
        private mockProvider: MockInvoiceProvider
    ) {
        this.registerProvider(mockProvider);
    }

    private registerProvider(provider: EInvoiceProvider) {
        this.providers.set(provider.providerCode, provider);
    }

    /**
     * Publishes an invoice using the active provider configuration for the tenant
     */
    async publishInvoice(tenantId: string, data: InvoiceData) {
        // 1. Get Active Config
        const config = await this.prisma.eInvoiceProviderConfig.findFirst({
            where: { tenantId, isActive: true }
        });

        // Default to MOCK if no config
        const providerCode = config?.provider || 'MOCK';
        const provider = this.providers.get(providerCode);

        if (!provider) {
            throw new BadRequestException(`Provider ${providerCode} not implemented`);
        }

        // 2. Create Log (PENDING)
        const log = await this.prisma.eInvoiceLog.create({
            data: {
                tenantId,
                provider: providerCode,
                transactionRef: data.transactionRef,
                status: EInvoiceStatus.PENDING,
                requestPayload: JSON.stringify(data),
            }
        });

        // 3. Call Provider
        try {
            const result = await provider.publish(data);

            // 4. Update Log
            await this.prisma.eInvoiceLog.update({
                where: { id: log.id },
                data: {
                    status: result.success ? EInvoiceStatus.PUBLISHED : EInvoiceStatus.FAILED,
                    externalId: result.externalId,
                    externalSerial: result.externalSerial,
                    externalNo: result.externalNo,
                    responsePayload: JSON.stringify(result.rawResponse),
                    errorMessage: result.errorMessage,
                    publishedAt: result.success ? new Date() : null
                }
            });

            return { ...result, logId: log.id };
        } catch (error: any) {
            await this.prisma.eInvoiceLog.update({
                where: { id: log.id },
                data: {
                    status: EInvoiceStatus.FAILED,
                    errorMessage: error.message,
                    responsePayload: JSON.stringify({ error: error.stack })
                }
            });
            throw error;
        }
    }
}
