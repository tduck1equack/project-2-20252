import { PaymentProvider, PaymentResult } from '../interfaces/payment-provider.interface';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import { format } from 'date-fns';

@Injectable()
export class VNPayProvider implements PaymentProvider {
    private readonly logger = new Logger(VNPayProvider.name);

    // Config should be injected via ConfigService, using hardcoded/process.env for MVP scaffolding
    private tmnCode = process.env.VNP_TMN_CODE || 'YourCode';
    private hashSecret = process.env.VNP_HASH_SECRET || 'YourSecret';
    private url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    private returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:3002/api/payment/vnpay_return';

    async createPaymentUrl(order: any, ipAddr: string): Promise<string> {
        const date = new Date();
        const createDate = format(date, 'yyyyMMddHHmmss');
        const orderId = order.code;

        const vnp_Params: any = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = this.tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = `Payment for order ${orderId}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = order.totalAmount * 100;
        vnp_Params['vnp_ReturnUrl'] = this.returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        const sortedParams = this.sortObject(vnp_Params);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", this.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        vnp_Params['vnp_SecureHash'] = signed;

        return `${this.url}?${querystring.stringify(vnp_Params, { encode: false })}`;
    }

    async verifyReturnUrl(query: any): Promise<PaymentResult> {
        let vnp_Params = query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this.sortObject(vnp_Params);
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", this.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            return {
                success: vnp_Params['vnp_ResponseCode'] === '00',
                orderCode: vnp_Params['vnp_TxnRef'],
                transactionId: vnp_Params['vnp_TransactionNo']
            };
        } else {
            return {
                success: false,
                orderCode: vnp_Params['vnp_TxnRef'],
                message: 'Invalid Signature'
            };
        }
    }

    private sortObject(obj: any) {
        let sorted: any = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
}
