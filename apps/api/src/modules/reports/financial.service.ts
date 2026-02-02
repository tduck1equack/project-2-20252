import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { AccountType, JournalStatus, Account, JournalEntryLine } from '@repo/database';

@Injectable()
export class FinancialReportService {
  constructor(private prisma: PrismaService) { }

  async generateBalanceSheet(tenantId: string, date: Date) {
    const accounts = await this.prisma.account.findMany({
      where: {
        tenantId,
        type: {
          in: [AccountType.ASSET, AccountType.LIABILITY, AccountType.EQUITY],
        },
      },
      include: {
        journalLines: {
          where: {
            entry: {
              date: { lte: date },
              status: JournalStatus.POSTED,
            },
          },
        },
      },
    });

    const accountBalances = accounts.map((account: Account & { journalLines: JournalEntryLine[] }) => {
      const totalDebit = account.journalLines.reduce(
        (sum: number, line: JournalEntryLine) => sum + Number(line.debit),
        0,
      );
      const totalCredit = account.journalLines.reduce(
        (sum: number, line: JournalEntryLine) => sum + Number(line.credit),
        0,
      );

      let balance = 0;
      if (account.type === AccountType.ASSET) {
        balance = totalDebit - totalCredit;
      } else {
        balance = totalCredit - totalDebit;
      }

      return {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        parentId: account.parentId,
        balance,
      };
    });

    return accountBalances;
  }

  async generateIncomeStatement(
    tenantId: string,
    fromDate: Date,
    toDate: Date,
  ) {
    const accounts = await this.prisma.account.findMany({
      where: {
        tenantId,
        type: { in: [AccountType.REVENUE, AccountType.EXPENSE] },
      },
      include: {
        journalLines: {
          where: {
            entry: {
              date: { gte: fromDate, lte: toDate },
              status: JournalStatus.POSTED,
            },
          },
        },
      },
    });

    const accountChanges = accounts.map((account: Account & { journalLines: JournalEntryLine[] }) => {
      const totalDebit = account.journalLines.reduce(
        (sum: number, line: JournalEntryLine) => sum + Number(line.debit),
        0,
      );
      const totalCredit = account.journalLines.reduce(
        (sum: number, line: JournalEntryLine) => sum + Number(line.credit),
        0,
      );

      let netChange = 0;
      if (account.type === AccountType.REVENUE) {
        netChange = totalCredit - totalDebit;
      } else {
        netChange = totalDebit - totalCredit;
      }

      return {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        netChange,
      };
    });

    const revenue = accountChanges
      .filter((a) => a.type === AccountType.REVENUE)
      .reduce((s, a) => s + a.netChange, 0);
    const expenses = accountChanges
      .filter((a) => a.type === AccountType.EXPENSE)
      .reduce((s, a) => s + a.netChange, 0);

    return {
      period: { fromDate, toDate },
      revenue,
      expenses,
      netProfit: revenue - expenses,
      details: accountChanges,
    };
  }
}
