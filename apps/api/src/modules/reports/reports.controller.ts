import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, createSuccessResponse, ApiResponseDto } from '@repo/dto';
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
    async getStockVelocity(@User() user: any, @Query('limit') limit?: string): Promise<ApiResponseDto<any[]>> {
        const data = await this.reportsService.getStockVelocity(
            user.tenantId,
            limit ? parseInt(limit, 10) : 10
        );
        return createSuccessResponse(data);
    }

    @Get('sales-summary')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get sales revenue summary' })
    @ApiQuery({ name: 'days', required: false, type: Number })
    async getSalesSummary(@User() user: any, @Query('days') days?: string): Promise<ApiResponseDto<any>> {
        const data = await this.reportsService.getSalesSummary(
            user.tenantId,
            days ? parseInt(days, 10) : 30
        );
        return createSuccessResponse(data);
    }

    @Get('stock-summary')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get current stock levels overview' })
    async getStockSummary(@User() user: any): Promise<ApiResponseDto<any>> {
        const data = await this.reportsService.getStockSummary(user.tenantId);
        return createSuccessResponse(data);
    }
}
