import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { Role } from '@repo/database';

@Injectable()
export class GetOrdersUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(tenantId: string, userId: string, role: string) {
        // Customer sees only their orders; Manager/Admin sees all
        if (role === Role.CUSTOMER) {
            return this.orderRepository.findByCustomer(tenantId, userId);
        }
        return this.orderRepository.findByTenant(tenantId);
    }
}
