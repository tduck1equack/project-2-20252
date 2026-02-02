import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { WarehouseDto } from '@repo/dto';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<WarehouseDto[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
    return warehouses as any;
  }

  async findOne(id: string): Promise<WarehouseDto | null> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });
    return warehouse as any;
  }
}
