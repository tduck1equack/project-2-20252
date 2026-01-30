import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';
import { JournalStatus, Prisma } from '@repo/database';

interface CreateJournalDto {
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

@Injectable()
export class JournalService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createdById: string, data: CreateJournalDto) {
        // 1. Validate Double Entry Balance
        const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
        const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

        // Using a small epsilon for floating point comparison if needed, but standard exact check is usually preferred in accounting unless rounding issues
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new BadRequestException(`Journal Entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
        }

        if (totalDebit === 0 && totalCredit === 0) {
            throw new BadRequestException('Journal Entry must have non-zero value');
        }

        // 2. Create Entry
        return this.prisma.journalEntry.create({
            data: {
                date: data.date ? new Date(data.date) : new Date(),
                reference: data.reference,
                description: data.description,
                status: JournalStatus.POSTED, // Auto-post manual entries for now
                tenantId,
                createdById, // Optional relation
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
                lines: {
                    include: { account: true }
                }
            }
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.journalEntry.findMany({
            where: { tenantId },
            include: {
                lines: {
                    include: { account: true }
                }
            },
            orderBy: { date: 'desc' },
        });
    }
}
