import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../auth/guards/ws-auth.guard';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
    namespace: 'inventory',
    cors: {
        origin: '*', // Config in prod
    },
})
export class InventoryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    handleConnection(client: Socket) {
        // console.log('Client connected', client.id);
    }

    handleDisconnect(client: Socket) {
        // console.log('Client disconnected', client.id);
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('joinTenant')
    handleJoinTenant(client: Socket, tenantId: string) {
        // Basic room joining. Guard ensures user is authorized.
        // In production, validate user belongs to tenantId.
        // console.log(`Client ${client.id} joining tenant ${tenantId}`);
        client.join(`tenant:${tenantId}`);
        return { event: 'joined', data: tenantId };
    }

    @OnEvent('stock.updated')
    handleStockUpdate(payload: { tenantId: string; warehouseId: string; variantId: string }) {
        this.server.to(`tenant:${payload.tenantId}`).emit('stock.updated', payload);
    }
}
