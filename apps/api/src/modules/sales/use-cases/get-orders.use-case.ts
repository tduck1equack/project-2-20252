import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class GetOrdersUseCase {
    constructor(private prisma: PrismaService) { }

    async execute(tenantId: string, userId: string, role: string, filters?: any) {
        // If Customer, force userId filter
        const where: any = { tenantId };

        if (role === 'CUSTOMER') {
            where.customerId = userId;
        }

        return this.prisma.salesOrder.findMany({
            where,
            include: {
                items: {
                    include: {
                        productVariant: true
                    }
                },
                customer: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
