import { Controller, Post, Get, Patch, Body, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@repo/dto';
import { OrderStatus } from '@repo/database';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { GetOrdersUseCase } from './use-cases/get-orders.use-case';
import { UpdateOrderStatusUseCase } from './use-cases/update-order-status.use-case';
import { User } from '../auth/decorators/user.decorator';

// DTOs (inline for now)
export class CreateOrderDto {
    items!: {
        productVariantId: string;
        quantity: number;
    }[];
}

export class UpdateOrderStatusDto {
    status!: OrderStatus;
}

@ApiTags('Sales')
@Controller('sales')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class SalesController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
        private getOrdersUseCase: GetOrdersUseCase,
        private updateOrderStatusUseCase: UpdateOrderStatusUseCase
    ) { }

    @Post('orders')
    @Roles(Role.CUSTOMER)
    @ApiOperation({ summary: 'Create a new sales order' })
    async createOrder(@User() user: any, @Body() dto: CreateOrderDto) {
        if (!user || !user.id || !user.tenantId) throw new UnauthorizedException();
        return this.createOrderUseCase.execute(user.tenantId, user.id, dto);
    }

    @Get('orders')
    @Roles(Role.CUSTOMER, Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get orders (Customers see own, Managers see all)' })
    async getOrders(@User() user: any) {
        if (!user || !user.id || !user.tenantId) throw new UnauthorizedException();
        return this.getOrdersUseCase.execute(user.tenantId, user.id, user.role);
    }

    @Patch('orders/:id/status')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Update order status (Manager only)' })
    async updateOrderStatus(
        @User() user: any,
        @Param('id') orderId: string,
        @Body() dto: UpdateOrderStatusDto
    ) {
        if (!user || !user.tenantId) throw new UnauthorizedException();
        return this.updateOrderStatusUseCase.execute(user.tenantId, orderId, dto.status);
    }
}
