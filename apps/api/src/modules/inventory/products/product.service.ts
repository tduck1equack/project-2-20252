import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { ProductDto, CreateProductDto } from '@repo/dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateProductDto): Promise<ProductDto> {
        const { variants, ...productData } = dto;

        const product = await this.prisma.product.create({
            data: {
                ...productData,
                tenantId,
                variants: {
                    create: variants?.map(v => ({
                        ...v,
                        // SKU for variant usually different, but for simplicity we rely on input or auto-gen
                        // If dto.variants not provided, maybe create default?
                        // For now assume strictly provided or logic handled elsewhere.
                        // Let's assume variants usually provided. 
                    }))
                }
            },
            include: {
                variants: true
            }
        });

        // Map to DTO if needed (Prisma object matches DTO mostly)
        return product as any; // Cast for now, refined later
    }

    async findAll(tenantId: string, search?: string): Promise<ProductDto[]> {
        const where: any = { tenantId };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        const products = await this.prisma.product.findMany({
            where,
            include: { variants: true },
            orderBy: { name: 'asc' }
        });

        return products as any;
    }

    async findOne(id: string): Promise<ProductDto | null> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { variants: true }
        });
        return product as any;
    }
}
