import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BatchService } from '../services/batch.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('batches')
export class BatchController {
    constructor(private readonly batchService: BatchService) { }

    @Post()
    create(@Body() dto: { code: string; productVariantId: string; expiryDate?: string; manufacturingDate?: string }) {
        return this.batchService.create({
            ...dto,
            expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
            manufacturingDate: dto.manufacturingDate ? new Date(dto.manufacturingDate) : undefined,
        });
    }

    @Get('variant/:id')
    findAll(@Param('id') productVariantId: string) {
        return this.batchService.findAll(productVariantId);
    }
}
