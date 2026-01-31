import { PrismaClient, Prisma } from '@prisma/client';
import { env } from '@repo/config';

// Re-export PrismaClient and Prisma namespace
export { PrismaClient, Prisma } from '@prisma/client';

// Re-export enums from generated client
export {
    MovementType,
    MovementStatus,
    AccountType,
    JournalStatus,
    Role,
    EInvoiceStatus,
    OrderStatus,
} from '@prisma/client';

// Type exports from Prisma
export type {
    EInvoiceProviderConfig,
    EInvoiceLog,
    Tenant,
    Account,
    JournalEntry,
    JournalEntryLine,
    User,
    Warehouse,
    Product,
    ProductVariant,
    Uom,
    Batch,
    Stock,
    StockMovement,
    StockMovementItem,
    RefreshToken,
    SalesOrder,
    SalesOrderItem,
} from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: env.DATABASE_URL,
            },
        },
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
