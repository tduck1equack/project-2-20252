import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get top moved products (stock velocity) - most stock movements
   */
  async getStockVelocity(tenantId: string, limit = 10) {
    // Aggregate movement items by variant
    const movements = await this.prisma.stockMovementItem.groupBy({
      by: ['productVariantId'],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
      where: {
        movement: { tenantId },
      },
    });

    // Enrich with product names
    const variantIds = movements.map((m) => m.productVariantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true } } },
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    return movements.map((m) => {
      const variant = variantMap.get(m.productVariantId);
      return {
        productVariantId: m.productVariantId,
        name: variant ? `${variant.product.name} - ${variant.name}` : 'Unknown',
        totalQuantity: m._sum.quantity || 0,
        movementCount: m._count.id,
      };
    });
  }

  /**
   * Get sales summary - revenue by day/period
   */
  async getSalesSummary(tenantId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.salesOrder.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const dailyRevenue = new Map<string, { revenue: number; orders: number }>();
    const statusCounts = { PENDING: 0, CONFIRMED: 0, SHIPPED: 0, CANCELLED: 0 };

    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const existing = dailyRevenue.get(dateKey) || { revenue: 0, orders: 0 };

      if (order.status !== 'CANCELLED') {
        existing.revenue += Number(order.totalAmount);
      }
      existing.orders += 1;
      dailyRevenue.set(dateKey, existing);

      if (order.status in statusCounts) {
        statusCounts[order.status as keyof typeof statusCounts]++;
      }
    });

    const revenueByDay = Array.from(dailyRevenue.entries()).map(
      ([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }),
    );

    const totalRevenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((acc, o) => acc + Number(o.totalAmount), 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      revenueByDay,
      ordersByStatus: statusCounts,
    };
  }

  /**
   * Get current stock levels summary
   */
  async getStockSummary(tenantId: string) {
    const stocks = await this.prisma.stock.findMany({
      where: {
        warehouse: { tenantId },
      },
      include: {
        productVariant: { include: { product: true } },
        warehouse: { select: { name: true } },
      },
    });

    const totalValue = stocks.reduce((acc, s) => {
      const price = Number(s.productVariant.price) || 0;
      return acc + price * s.quantity;
    }, 0);

    const lowStockItems = stocks
      .filter((s) => s.quantity > 0 && s.quantity < 10)
      .map((s) => ({
        name: `${s.productVariant.product.name} - ${s.productVariant.name}`,
        warehouse: s.warehouse.name,
        quantity: s.quantity,
      }));

    return {
      totalItems: stocks.length,
      totalValue,
      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems.slice(0, 5),
    };
  }
}
