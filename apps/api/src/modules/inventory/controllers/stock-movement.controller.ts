import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StockMovementService } from '../services/stock-movement.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementController {
    constructor(private readonly service: StockMovementService) { }

    @Post()
    create(@Request() req: any, @Body() dto: any) {
        return this.service.create(req.user.tenantId, req.user.userId, dto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.service.findAll(req.user.tenantId);
    }
}
