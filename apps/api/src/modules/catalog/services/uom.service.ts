import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { Uom } from '@repo/database';

@Injectable()
export class UomService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; code: string; tenantId: string }): Promise<Uom> {
        return this.prisma.uom.create({
            data,
        });
    }

    async findAll(tenantId: string): Promise<Uom[]> {
        return this.prisma.uom.findMany({
            where: { tenantId },
        });
    }

    async findOne(id: string, tenantId: string): Promise<Uom | null> {
        return this.prisma.uom.findFirst({
            where: { id, tenantId },
        });
    }

    async update(id: string, tenantId: string, data: { name?: string; code?: string }): Promise<any> {
        return this.prisma.uom.updateMany({
            where: { id, tenantId },
            data,
        });
    }

    async remove(id: string, tenantId: string): Promise<any> {
        return this.prisma.uom.deleteMany({
            where: { id, tenantId },
        });
    }
}
