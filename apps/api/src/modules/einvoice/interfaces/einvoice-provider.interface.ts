/**
 * @file einvoice-provider.interface.ts
 * @description Standard Interface for E-Invoice Providers (Viettel, VNPT, etc.)
 */

export class InvoiceData {
  transactionRef: string; // Internal Order/Invoice ID
  taxCode: string;
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  items: {
    name: string;
    unit: string;
    quantity: number;
    price: number;
    amount: number;
    vatRate: number; // 0, 5, 8, 10
  }[];
  totalAmount: number;
  vatAmount: number;
}

export interface PublishResult {
  success: boolean;
  externalId?: string; // Provider's Invoice ID (e.g. system ID)
  externalSerial?: string; // e.g. C23TAA
  externalNo?: string; // e.g. 0001234
  externalUrl?: string; // View link
  errorMessage?: string;
  rawResponse?: any;
}

export interface EInvoiceProvider {
  /**
   * Unique Provider Code (e.g. "MOCK", "VIETTEL")
   */
  readonly providerCode: string;

  /**
   * Publish an invoice to the external provider
   */
  publish(invoice: InvoiceData): Promise<PublishResult>;

  /**
   * Check status of a previously published invoice
   */
  checkStatus(externalId: string): Promise<PublishResult>;
}
