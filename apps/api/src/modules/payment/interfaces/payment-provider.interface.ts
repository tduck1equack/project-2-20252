export interface PaymentResult {
    success: boolean;
    orderCode: string;
    transactionId?: string;
    message?: string;
}

export interface PaymentProvider {
    createPaymentUrl(order: any, ipAddr: string): Promise<string>;
    verifyReturnUrl(query: any): Promise<PaymentResult>;
}
