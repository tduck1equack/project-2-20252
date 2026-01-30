import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StockMovementService } from '../services/stock-movement.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementController {
    constructor(private readonly service: StockMovementService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new stock movement (receipt, issue, transfer)' })
    create(@Request() req: any, @Body() dto: any) {
        return this.service.create(req.user.tenantId, req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all stock movements' })
    findAll(@Request() req: any) {
        return this.service.findAll(req.user.tenantId);
    }
}
