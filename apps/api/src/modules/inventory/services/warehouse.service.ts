import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Warehouse } from '@repo/database';

@Injectable()
export class WarehouseService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; location?: string; tenantId: string }): Promise<Warehouse> {
        return this.prisma.warehouse.create({
            data,
        });
    }

    async findAll(tenantId: string): Promise<Warehouse[]> {
        return this.prisma.warehouse.findMany({
            where: { tenantId },
        });
    }

    async findOne(id: string, tenantId: string): Promise<Warehouse | null> {
        return this.prisma.warehouse.findFirst({
            where: { id, tenantId },
        });
    }

    async update(id: string, tenantId: string, data: { name?: string; location?: string }): Promise<any> {
        return this.prisma.warehouse.updateMany({
            where: { id, tenantId },
            data,
        });
    }

    async remove(id: string, tenantId: string): Promise<any> {
        return this.prisma.warehouse.deleteMany({
            where: { id, tenantId },
        });
    }
}
