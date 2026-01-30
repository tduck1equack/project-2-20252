import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Batch } from '@repo/database';

@Injectable()
export class BatchService {
    constructor(private prisma: PrismaService) { }

    async create(data: { code: string; productVariantId: string; expiryDate?: Date; manufacturingDate?: Date }) {
        return this.prisma.batch.create({
            data,
        });
    }

    async findAll(productVariantId: string) {
        return this.prisma.batch.findMany({
            where: { productVariantId },
        });
    }
}
