import { Injectable, Inject } from '@nestjs/common';
import { CreateProductDto, ProductDto, PaginationDto } from '@repo/dto';
import type { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
    constructor(
        @Inject('ProductRepository') private productRepo: ProductRepository
    ) { }

    async create(tenantId: string, dto: CreateProductDto): Promise<ProductDto> {
        const product = await this.productRepo.create(dto, tenantId);
        return product as unknown as ProductDto;
    }

    async findAll(tenantId: string, search?: string): Promise<ProductDto[]> {
        // Updated to use pageSize
        const result = await this.productRepo.findAll(
            tenantId,
            { page: 1, pageSize: 100 } as PaginationDto,
            search
        );
        return result.items as unknown as ProductDto[];
    }

    async findOne(id: string, tenantId: string): Promise<ProductDto | null> {
        const product = await this.productRepo.findById(id, tenantId);
        return product as unknown as ProductDto | null;
    }
}
