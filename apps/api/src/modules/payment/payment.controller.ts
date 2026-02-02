import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create_url')
    async createUrl(@Body() body: { order: any }, @Req() req: Request) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const url = await this.paymentService.createPaymentUrl(body.order, ip as string);
        return { url };
    }

    @Get('vnpay_return')
    async vnpayReturn(@Query() query: any, @Res() res: Response) {
        const result = await this.paymentService.verifyReturn(query);
        // Redirect to frontend based on result
        if (result.success) {
            return res.redirect(`http://localhost:3000/checkout/success?orderCode=${result.orderCode}&status=success`);
        } else {
            return res.redirect(`http://localhost:3000/checkout/failed?orderCode=${result.orderCode}`);
        }
    }
}
