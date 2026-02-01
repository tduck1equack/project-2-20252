import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BatchService } from '../services/batch.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Catalog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('batches')
export class BatchController {
    constructor(private readonly batchService: BatchService) { }

    @Post()
    @ApiOperation({ summary: 'Create a batch for a product variant' })
    async create(
        @Body() dto: { code: string; productVariantId: string; expiryDate?: string; manufacturingDate?: string }
    ): Promise<ApiResponseDto<any>> {
        const batch = await this.batchService.create({
            ...dto,
            expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
            manufacturingDate: dto.manufacturingDate ? new Date(dto.manufacturingDate) : undefined,
        });
        return createSuccessResponse(batch, 201);
    }

    @Get('variant/:id')
    @ApiOperation({ summary: 'Get all batches for a product variant' })
    async findAll(@Param('id') productVariantId: string): Promise<ApiResponseDto<any[]>> {
        const batches = await this.batchService.findAll(productVariantId);
        return createSuccessResponse(batches);
    }
}
