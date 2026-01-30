import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseDto, ApiResponseDto, createSuccessResponse } from '@repo/dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory: Warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Get()
    @Roles('MANAGER', 'EMPLOYEE', 'ADMIN') // Customers don't need to see warehouses list typically? Or maybe they do for pickup? stick to internal for now.
    @ApiOperation({ summary: 'List all warehouses' })
    async findAll(@Request() req: any): Promise<ApiResponseDto<WarehouseDto[]>> {
        const warehouses = await this.warehouseService.findAll(req.user.tenantId);
        return createSuccessResponse(warehouses);
    }
}
