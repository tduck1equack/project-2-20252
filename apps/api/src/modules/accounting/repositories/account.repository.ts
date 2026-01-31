import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Account, AccountType, Prisma } from '@repo/database';
import { CORE_ACCOUNTS } from '../data/coa';

export interface IAccountRepository {
    create(tenantId: string, data: { code: string; name: string; type: AccountType; details?: string; parentId?: string }): Promise<Account>;
    findAll(tenantId: string): Promise<Account[]>;
    findByCode(tenantId: string, code: string): Promise<Account | null>;
    seedCore(tenantId: string): Promise<void>;
}

@Injectable()
export class AccountRepository implements IAccountRepository {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: { code: string; name: string; type: AccountType; details?: string; parentId?: string }): Promise<Account> {
        return this.prisma.account.create({
            data: { ...data, tenantId },
        });
    }

    async findAll(tenantId: string): Promise<Account[]> {
        return this.prisma.account.findMany({
            where: { tenantId },
            orderBy: { code: 'asc' },
        });
    }

    async findByCode(tenantId: string, code: string): Promise<Account | null> {
        return this.prisma.account.findFirst({
            where: { tenantId, code },
        });
    }

    async seedCore(tenantId: string): Promise<void> {
        const data = CORE_ACCOUNTS.map(acc => ({
            ...acc,
            tenantId,
        }));

        await this.prisma.account.createMany({
            data,
            skipDuplicates: true,
        });
    }
}
