import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EInvoiceService } from '../services/einvoice.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { InvoiceData } from '../interfaces/einvoice-provider.interface';

@UseGuards(JwtAuthGuard)
@Controller('einvoice')
export class EInvoiceController {
    constructor(private readonly service: EInvoiceService) { }

    @Post('publish')
    publish(@Request() req: any, @Body() data: InvoiceData) {
        return this.service.publishInvoice(req.user.tenantId, data);
    }
}
