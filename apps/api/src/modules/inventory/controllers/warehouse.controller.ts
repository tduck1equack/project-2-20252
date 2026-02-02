import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { WarehouseService } from '../services/warehouse.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created successfully' })
  async create(
    @Request() req: any,
    @Body() createWarehouseDto: { name: string; location?: string },
  ): Promise<ApiResponseDto<any>> {
    const warehouse = await this.warehouseService.create({
      ...createWarehouseDto,
      tenantId: req.user.tenantId,
    });
    return createSuccessResponse(warehouse, 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  async findAll(@Request() req: any): Promise<ApiResponseDto<any[]>> {
    const warehouses = await this.warehouseService.findAll(req.user.tenantId);
    return createSuccessResponse(warehouses);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse by ID' })
  async findOne(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<any>> {
    const warehouse = await this.warehouseService.findOne(
      id,
      req.user.tenantId,
    );
    return createSuccessResponse(warehouse);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateWarehouseDto: { name?: string; location?: string },
  ): Promise<ApiResponseDto<any>> {
    const warehouse = await this.warehouseService.update(
      id,
      req.user.tenantId,
      updateWarehouseDto,
    );
    return createSuccessResponse(warehouse);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse' })
  async remove(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<{ deleted: boolean }>> {
    await this.warehouseService.remove(id, req.user.tenantId);
    return createSuccessResponse({ deleted: true });
  }
}
