import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();
        const token = this.extractTokenFromHeader(client);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            // Attach user to socket
            (client as any).user = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(client: Socket): string | undefined {
        // Standard Bearer or Query param
        const authHeader = client.handshake.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') return token;
        }
        // Fallback to query param ?token=...
        return client.handshake.query.token as string;
    }
}
