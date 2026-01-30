import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { CORE_ACCOUNTS } from '../data/coa';
import { AccountType, Prisma } from '@repo/database';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: { code: string; name: string; type: AccountType; details?: string; parentId?: string }) {
        return this.prisma.account.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.account.findMany({
            where: { tenantId },
            orderBy: { code: 'asc' },
        });
    }

    async seed(tenantId: string) {
        const data = CORE_ACCOUNTS.map(acc => ({
            ...acc,
            tenantId,
        }));

        return this.prisma.account.createMany({
            data,
            skipDuplicates: true,
        });
    }
}
