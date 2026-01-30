import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@repo/dto';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { User } from '../auth/decorators/user.decorator';

// TODO: Create DTO in @repo/dto
// For now inline or using `any` until DTO package is updated
export class CreateOrderDto {
    items: {
        productVariantId: string;
        quantity: number;
    }[];
}

@ApiTags('Sales')
@Controller('sales')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class SalesController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase
    ) { }

    @Post('orders')
    @Roles(Role.CUSTOMER)
    @ApiOperation({ summary: 'Create a new sales order' })
    async createOrder(@User() user: any, @Body() dto: CreateOrderDto) {
        if (!user || !user.id || !user.tenantId) throw new UnauthorizedException();
        return this.createOrderUseCase.execute(user.tenantId, user.id, dto);
    }
}
