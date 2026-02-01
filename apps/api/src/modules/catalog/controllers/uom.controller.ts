import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UomService } from '../services/uom.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Catalog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('uoms')
export class UomController {
    constructor(private readonly uomService: UomService) { }

    @Post()
    @ApiOperation({ summary: 'Create a unit of measure' })
    async create(@Request() req: any, @Body() createUomDto: { name: string; code: string }): Promise<ApiResponseDto<any>> {
        const uom = await this.uomService.create({ ...createUomDto, tenantId: req.user.tenantId });
        return createSuccessResponse(uom, 201);
    }

    @Get()
    @ApiOperation({ summary: 'List all units of measure' })
    async findAll(@Request() req: any): Promise<ApiResponseDto<any[]>> {
        const uoms = await this.uomService.findAll(req.user.tenantId);
        return createSuccessResponse(uoms);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get UOM by ID' })
    async findOne(@Request() req: any, @Param('id') id: string): Promise<ApiResponseDto<any>> {
        const uom = await this.uomService.findOne(id, req.user.tenantId);
        return createSuccessResponse(uom);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a UOM' })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateUomDto: { name?: string; code?: string }
    ): Promise<ApiResponseDto<any>> {
        const uom = await this.uomService.update(id, req.user.tenantId, updateUomDto);
        return createSuccessResponse(uom);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a UOM' })
    async remove(@Request() req: any, @Param('id') id: string): Promise<ApiResponseDto<{ deleted: boolean }>> {
        await this.uomService.remove(id, req.user.tenantId);
        return createSuccessResponse({ deleted: true });
    }
}
