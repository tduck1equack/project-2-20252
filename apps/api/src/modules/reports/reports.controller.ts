import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, createSuccessResponse, ApiResponseDto } from '@repo/dto';
import { User } from '../auth/decorators/user.decorator';
import { ReportsService } from './reports.service';
import { FinancialReportService } from './financial.service';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private financialService: FinancialReportService,
  ) {}

  @Get('stock-velocity')
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiOperation({ summary: 'Get top moved products by quantity' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getStockVelocity(
    @User() user: any,
    @Query('limit') limit?: string,
  ): Promise<ApiResponseDto<any[]>> {
    const data = await this.reportsService.getStockVelocity(
      user.tenantId,
      limit ? parseInt(limit, 10) : 10,
    );
    return createSuccessResponse(data);
  }

  @Get('sales-summary')
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiOperation({ summary: 'Get sales revenue summary' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getSalesSummary(
    @User() user: any,
    @Query('days') days?: string,
  ): Promise<ApiResponseDto<any>> {
    const data = await this.reportsService.getSalesSummary(
      user.tenantId,
      days ? parseInt(days, 10) : 30,
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
  @Get('financial/balance-sheet')
  @Roles(Role.MANAGER, Role.ADMIN, Role.ACCOUNTANT)
  @ApiOperation({ summary: 'Get Balance Sheet (B01-DN)' })
  @ApiQuery({ name: 'date', required: true, type: String })
  async getBalanceSheet(
    @User() user: any,
    @Query('date') date: string,
  ): Promise<ApiResponseDto<any[]>> {
    const data = await this.financialService.generateBalanceSheet(
      user.tenantId,
      new Date(date),
    );
    return createSuccessResponse(data);
  }

  @Get('financial/income-statement')
  @Roles(Role.MANAGER, Role.ADMIN, Role.ACCOUNTANT)
  @ApiOperation({ summary: 'Get Income Statement (B02-DN)' })
  @ApiQuery({ name: 'fromDate', required: true, type: String })
  @ApiQuery({ name: 'toDate', required: true, type: String })
  async getIncomeStatement(
    @User() user: any,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<ApiResponseDto<any>> {
    const data = await this.financialService.generateIncomeStatement(
      user.tenantId,
      new Date(fromDate),
      new Date(toDate),
    );
    return createSuccessResponse(data);
  }
}
