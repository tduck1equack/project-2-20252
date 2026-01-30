import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UomService } from '../services/uom.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('uoms')
export class UomController {
    constructor(private readonly uomService: UomService) { }

    @Post()
    create(@Request() req: any, @Body() createUomDto: { name: string; code: string }) {
        return this.uomService.create({ ...createUomDto, tenantId: req.user.tenantId });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.uomService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.uomService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() updateUomDto: { name?: string; code?: string }) {
        return this.uomService.update(id, req.user.tenantId, updateUomDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.uomService.remove(id, req.user.tenantId);
    }
}
