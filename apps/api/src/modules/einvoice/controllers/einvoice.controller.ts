import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EInvoiceService } from '../services/einvoice.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { InvoiceData } from '../interfaces/einvoice-provider.interface';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('E-Invoice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('einvoice')
export class EInvoiceController {
  constructor(private readonly service: EInvoiceService) {}

  @Post('publish')
  @ApiOperation({ summary: 'Publish an electronic invoice' })
  async publish(
    @Request() req: any,
    @Body() data: InvoiceData,
  ): Promise<ApiResponseDto<any>> {
    const result = await this.service.publishInvoice(req.user.tenantId, data);
    return createSuccessResponse(result, 201);
  }

  @Post('issue')
  @ApiOperation({ summary: 'Issue E-Invoice from Sales Order' })
  async issue(
    @Request() req: any,
    @Body() body: { orderId: string },
  ): Promise<ApiResponseDto<any>> {
    const result = await this.service.issueInvoice(
      req.user.tenantId,
      body.orderId,
    );
    return createSuccessResponse(result, 201);
  }
}
