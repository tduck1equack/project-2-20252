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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Catalog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('catalog/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  async create(
    @Request() req: any,
    @Body()
    createProductDto: {
      name: string;
      sku: string;
      description?: string;
      uomId: string;
      variants?: any[];
    },
  ): Promise<ApiResponseDto<any>> {
    const product = await this.productService.create({
      ...createProductDto,
      tenantId: req.user.tenantId,
    });
    return createSuccessResponse(product, 201);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  async findAll(@Request() req: any): Promise<ApiResponseDto<any[]>> {
    const products = await this.productService.findAll(req.user.tenantId);
    return createSuccessResponse(products);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<any>> {
    const product = await this.productService.findOne(id, req.user.tenantId);
    return createSuccessResponse(product);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    updateProductDto: { name?: string; description?: string; uomId?: string },
  ): Promise<ApiResponseDto<any>> {
    const product = await this.productService.update(
      id,
      req.user.tenantId,
      updateProductDto,
    );
    return createSuccessResponse(product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async remove(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<{ deleted: boolean }>> {
    await this.productService.remove(id, req.user.tenantId);
    return createSuccessResponse({ deleted: true });
  }
}
