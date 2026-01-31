import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SalesOrder, OrderStatus, Prisma } from '@repo/database';

export interface IOrderRepository {
    create(data: Prisma.SalesOrderCreateInput): Promise<SalesOrder>;
    findById(id: string, include?: Prisma.SalesOrderInclude): Promise<SalesOrder | null>;
    findByTenant(tenantId: string): Promise<SalesOrder[]>;
    findByCustomer(tenantId: string, customerId: string): Promise<SalesOrder[]>;
    updateStatus(id: string, status: OrderStatus): Promise<SalesOrder>;
}

@Injectable()
export class OrderRepository implements IOrderRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SalesOrderCreateInput): Promise<SalesOrder> {
        return this.prisma.salesOrder.create({ data });
    }

    async findById(id: string, include?: Prisma.SalesOrderInclude): Promise<SalesOrder | null> {
        return this.prisma.salesOrder.findUnique({
            where: { id },
            include: include || {
                items: { include: { productVariant: true } },
                customer: { select: { name: true, email: true } }
            }
        }) as any;
    }

    async findByTenant(tenantId: string): Promise<SalesOrder[]> {
        return this.prisma.salesOrder.findMany({
            where: { tenantId },
            include: {
                items: { include: { productVariant: true } },
                customer: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByCustomer(tenantId: string, customerId: string): Promise<SalesOrder[]> {
        return this.prisma.salesOrder.findMany({
            where: { tenantId, customerId },
            include: {
                items: { include: { productVariant: true } },
                customer: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateStatus(id: string, status: OrderStatus): Promise<SalesOrder> {
        return this.prisma.salesOrder.update({
            where: { id },
            data: { status }
        });
    }

    // Transaction helper for complex operations
    async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}
