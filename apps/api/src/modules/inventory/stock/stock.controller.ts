import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { StockService } from './stock.service';
import {
  StockLevelDto,
  ApiResponseDto,
  createSuccessResponse,
  UserRole,
} from '@repo/dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Inventory: Stock')
@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Roles('MANAGER', 'EMPLOYEE', 'ADMIN') // Employees check stock. Customers check via Product API? Or here?
  // Let's keep this for internal detailed stock. Customers use Product list which implies stock.
  @ApiOperation({ summary: 'Get current stock levels' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getStocks(
    @Request() req: any,
    @Query('warehouseId') warehouseId?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponseDto<StockLevelDto[]>> {
    const stocks = await this.stockService.getStocks(
      req.user.tenantId,
      warehouseId,
      search,
    );
    return createSuccessResponse(stocks);
  }
}
