import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { CreateProductDto, PaginationDto } from '@repo/dto';

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ProductRepository {
    create(data: CreateProductDto, tenantId: string): Promise<Product>;
    findAll(tenantId: string, pagination: PaginationDto, search?: string): Promise<PaginatedResult<Product>>;
    findById(id: string, tenantId: string): Promise<Product | null>;
}

@Injectable()
export class PrismaProductRepository implements ProductRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateProductDto, tenantId: string): Promise<Product> {
        return this.prisma.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                description: data.description,
                uomId: data.uomId,
                tenantId: tenantId,
                variants: {
                    create: data.variants?.map(v => ({
                        sku: v.sku,
                        name: v.name,
                    }))
                }
            },
            include: { variants: true, uom: true }
        });
    }

    async findAll(tenantId: string, pagination: PaginationDto, search?: string): Promise<PaginatedResult<Product>> {
        const { page = 1, pageSize = 10 } = pagination;
        const skip = (page - 1) * pageSize;

        const where: Prisma.ProductWhereInput = {
            tenantId,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { variants: { some: { sku: { contains: search, mode: 'insensitive' } } } }
                ]
            })
        };

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                include: { variants: true, uom: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.product.count({ where })
        ]);

        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }

    async findById(id: string, tenantId: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: { variants: true, uom: true }
        });
    }
}
