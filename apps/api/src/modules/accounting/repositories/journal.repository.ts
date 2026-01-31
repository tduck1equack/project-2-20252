import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JournalEntry, JournalStatus, Prisma } from '@repo/database';

export interface CreateJournalData {
    date: Date;
    reference?: string;
    description?: string;
    lines: {
        accountId: string;
        debit: number;
        credit: number;
        description?: string;
    }[];
}

export interface IJournalRepository {
    create(tenantId: string, createdById: string, data: CreateJournalData): Promise<JournalEntry>;
    findAll(tenantId: string): Promise<JournalEntry[]>;
    findById(id: string): Promise<JournalEntry | null>;
}

@Injectable()
export class JournalRepository implements IJournalRepository {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createdById: string, data: CreateJournalData): Promise<JournalEntry> {
        // Validate Double Entry Balance
        const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
        const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new BadRequestException(`Journal Entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
        }

        if (totalDebit === 0 && totalCredit === 0) {
            throw new BadRequestException('Journal Entry must have non-zero value');
        }

        return this.prisma.journalEntry.create({
            data: {
                date: data.date ? new Date(data.date) : new Date(),
                reference: data.reference,
                description: data.description,
                status: JournalStatus.POSTED,
                tenantId,
                createdById,
                lines: {
                    create: data.lines.map(line => ({
                        accountId: line.accountId,
                        debit: line.debit || 0,
                        credit: line.credit || 0,
                        description: line.description,
                    })),
                },
            },
            include: {
                lines: { include: { account: true } }
            }
        });
    }

    async findAll(tenantId: string): Promise<JournalEntry[]> {
        return this.prisma.journalEntry.findMany({
            where: { tenantId },
            include: {
                lines: { include: { account: true } }
            },
            orderBy: { date: 'desc' },
        });
    }

    async findById(id: string): Promise<JournalEntry | null> {
        return this.prisma.journalEntry.findUnique({
            where: { id },
            include: {
                lines: { include: { account: true } }
            }
        });
    }

    // Transaction helper for complex operations
    async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}
