import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@repo/dto';
import { User } from '../auth/decorators/user.decorator';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get('stock-velocity')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get top moved products by quantity' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getStockVelocity(@User() user: any, @Query('limit') limit?: string) {
        return this.reportsService.getStockVelocity(
            user.tenantId,
            limit ? parseInt(limit, 10) : 10
        );
    }

    @Get('sales-summary')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get sales revenue summary' })
    @ApiQuery({ name: 'days', required: false, type: Number })
    async getSalesSummary(@User() user: any, @Query('days') days?: string) {
        return this.reportsService.getSalesSummary(
            user.tenantId,
            days ? parseInt(days, 10) : 30
        );
    }

    @Get('stock-summary')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get current stock levels overview' })
    async getStockSummary(@User() user: any) {
        return this.reportsService.getStockSummary(user.tenantId);
    }
}
