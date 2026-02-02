import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  EInvoiceProvider,
  InvoiceData,
} from '../interfaces/einvoice-provider.interface';
import { MockInvoiceProvider } from '../providers/mock-einvoice.provider';
import { EInvoiceStatus, Prisma } from '@repo/database';

@Injectable()
export class EInvoiceService {
  private providers: Map<string, EInvoiceProvider> = new Map();

  constructor(
    private prisma: PrismaService,
    private mockProvider: MockInvoiceProvider,
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
      where: { tenantId, isActive: true },
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
      },
    });

    // 3. Call Provider
    try {
      const result = await provider.publish(data);

      // 4. Update Log
      await this.prisma.eInvoiceLog.update({
        where: { id: log.id },
        data: {
          status: result.success
            ? EInvoiceStatus.PUBLISHED
            : EInvoiceStatus.FAILED,
          externalId: result.externalId,
          externalSerial: result.externalSerial,
          externalNo: result.externalNo,
          responsePayload: JSON.stringify(result.rawResponse),

          // VAS: Save signed XML and Signature
          requestPayload:
            result.rawResponse?.xml ||
            result.rawResponse?.signedXml ||
            undefined,
          signature: result.rawResponse?.signature || undefined,

          errorMessage: result.errorMessage,
          publishedAt: result.success ? new Date() : null,
        },
      });

      return { ...result, logId: log.id };
    } catch (error: any) {
      await this.prisma.eInvoiceLog.update({
        where: { id: log.id },
        data: {
          status: EInvoiceStatus.FAILED,
          errorMessage: error.message,
          responsePayload: JSON.stringify({ error: error.stack }),
        },
      });
      throw error;
    }
  }

  async issueInvoice(tenantId: string, orderId: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: { uom: true },
                },
              },
            },
          },
        },
        customer: true,
      },
    });

    if (!order || order.tenantId !== tenantId) {
      throw new BadRequestException('Order not found or access denied');
    }

    const invoiceData: InvoiceData = {
      transactionRef: order.code,
      customerName: order.customer?.name || 'Guest',
      customerEmail: order.customer?.email,
      taxCode: '',
      customerAddress: '',
      items: order.items.map((item) => ({
        name: item.productVariant.name,
        unit: item.productVariant.product.uom.name,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        amount: Number(item.totalPrice),
        vatRate: 10,
      })),
      totalAmount: Number(order.totalAmount),
      vatAmount: Number(order.taxAmount || 0),
    };

    return this.publishInvoice(tenantId, invoiceData);
  }
}
