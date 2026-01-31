import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RefreshToken, User } from '@repo/database';

export interface IRefreshTokenRepository {
    create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken>;
    findByToken(token: string): Promise<(RefreshToken & { user: User }) | null>;
    revokeToken(id: string): Promise<void>;
    revokeAllForUser(userId: string): Promise<void>;
}

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
        return this.prisma.refreshToken.create({
            data: { userId, token, expiresAt },
        });
    }

    async findByToken(token: string): Promise<(RefreshToken & { user: User }) | null> {
        return this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }

    async revokeToken(id: string): Promise<void> {
        await this.prisma.refreshToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
}
