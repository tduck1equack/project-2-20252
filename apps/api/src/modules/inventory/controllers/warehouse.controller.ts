import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WarehouseService } from '../services/warehouse.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new warehouse' })
    @ApiResponse({ status: 201, description: 'Warehouse created successfully' })
    create(@Request() req: any, @Body() createWarehouseDto: { name: string; location?: string }) {
        return this.warehouseService.create({
            ...createWarehouseDto,
            tenantId: req.user.tenantId
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get all warehouses' })
    findAll(@Request() req: any) {
        return this.warehouseService.findAll(req.user.tenantId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a warehouse by ID' })
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.warehouseService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a warehouse' })
    update(@Request() req: any, @Param('id') id: string, @Body() updateWarehouseDto: { name?: string; location?: string }) {
        return this.warehouseService.update(id, req.user.tenantId, updateWarehouseDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a warehouse' })
    remove(@Request() req: any, @Param('id') id: string) {
        return this.warehouseService.remove(id, req.user.tenantId);
    }
}
