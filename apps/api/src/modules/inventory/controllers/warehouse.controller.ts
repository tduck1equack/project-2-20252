import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WarehouseService } from '../services/warehouse.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Post()
    create(@Request() req: any, @Body() createWarehouseDto: { name: string; location?: string }) {
        return this.warehouseService.create({
            ...createWarehouseDto,
            tenantId: req.user.tenantId
        });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.warehouseService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.warehouseService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() updateWarehouseDto: { name?: string; location?: string }) {
        return this.warehouseService.update(id, req.user.tenantId, updateWarehouseDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.warehouseService.remove(id, req.user.tenantId);
    }
}
