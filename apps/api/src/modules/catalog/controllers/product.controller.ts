import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Request() req: any, @Body() createProductDto: { name: string; sku: string; description?: string; uomId: string; variants?: any[] }) {
        return this.productService.create({ ...createProductDto, tenantId: req.user.tenantId });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.productService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.productService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() updateProductDto: { name?: string; description?: string; uomId?: string }) {
        return this.productService.update(id, req.user.tenantId, updateProductDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.productService.remove(id, req.user.tenantId);
    }
}
