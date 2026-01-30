import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductDto, ApiResponseDto, createSuccessResponse, UserRole } from '@repo/dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory: Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @Roles('MANAGER', 'ADMIN') // Only managers create products
    @ApiOperation({ summary: 'Create a new product' })
    async create(@Request() req: any, @Body() dto: CreateProductDto): Promise<ApiResponseDto<ProductDto>> {
        const product = await this.productService.create(req.user.tenantId, dto);
        return createSuccessResponse(product);
    }

    @Get()
    @Roles('MANAGER', 'EMPLOYEE', 'CUSTOMER', 'ADMIN') // Everyone can view
    @ApiOperation({ summary: 'List all products' })
    async findAll(@Request() req: any, @Query('search') search?: string): Promise<ApiResponseDto<ProductDto[]>> {
        const products = await this.productService.findAll(req.user.tenantId, search);
        return createSuccessResponse(products);
    }
}
