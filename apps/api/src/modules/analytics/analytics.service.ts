import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { Role } from '@repo/database';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getAdminStats() {
        // Global Stats (All Tenants)
        const totalUsers = await this.prisma.user.count();
        const totalOrders = await this.prisma.salesOrder.count();
        const revenue = await this.prisma.salesOrder.aggregate({
            _sum: { totalAmount: true },
        });

        // Top 5 Products (Global) via SalesOrderItem
        const topProducts = await this.prisma.salesOrderItem.groupBy({
            by: ['productVariantId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
        });

        const recentActivity = await this.prisma.stockMovement.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { createdBy: true, fromWarehouse: true, toWarehouse: true }
        });

        return {
            totalUsers,
            totalOrders,
            totalRevenue: revenue._sum.totalAmount || 0,
            topProducts,
            systemHealth: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
            },
            recentActivity: recentActivity.map(m => ({
                id: m.id,
                type: 'movement',
                title: m.type,
                description: `${m.code} by ${m.createdBy.name}`,
                time: m.createdAt.toISOString(),
                color: 'text-blue-500' // Dynamic color logic could be here
            }))
        };
    }

    async getManagerStats(tenantId: string) {
        const revenue = await this.prisma.salesOrder.aggregate({
            where: { tenantId },
            _sum: { totalAmount: true },
        });

        const activeOrders = await this.prisma.salesOrder.count({
            where: { tenantId, status: { not: 'CANCELLED' } },
        });

        const lowStock = await this.prisma.stock.findMany({
            where: {
                warehouse: { tenantId },
                quantity: { lt: 10 } // Threshold hardcoded for MVP
            },
            include: { productVariant: true, warehouse: true },
            take: 10
        });

        return {
            revenue: revenue._sum.totalAmount || 0,
            activeOrders,
            lowStockCount: lowStock.length,
            lowStockItems: lowStock.map(s => ({
                sku: s.productVariant.sku,
                name: s.productVariant.name,
                warehouse: s.warehouse.name,
                qty: s.quantity
            }))
        };
    }

    async getEmployeeStats(userId: string) {
        // My Stock Movements
        const movements = await this.prisma.stockMovement.count({
            where: { createdById: userId }
        });

        const recent = await this.prisma.stockMovement.findMany({
            where: { createdById: userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        return {
            movementsCount: movements,
            recentActivity: recent
        };
    }
}
