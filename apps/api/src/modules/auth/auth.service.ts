import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../providers/prisma.service';
import { TokenBlacklistService } from '../../redis/token-blacklist.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { env } from '@repo/config';

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

import { TokenPayload, RegisterDto, User } from '@repo/dto';



interface TokenPair {
    accessToken: string;
    expiresIn: number;
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private tokenBlacklist: TokenBlacklistService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Generate access token with unique JTI for blacklisting
     */
    private generateAccessToken(user: any): { token: string; jti: string } {
        const jti = crypto.randomUUID();
        const payload: TokenPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            jti,
        };
        const token = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRES });
        return { token, jti };
    }

    /**
     * Generate refresh token and store in database
     */
    private async generateRefreshToken(userId: string): Promise<string> {
        const token = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });

        return token;
    }

    /**
     * Login - returns access token and sets refresh token
     */
    async login(user: any): Promise<TokenPair & { refreshToken: string }> {
        const { token: accessToken, jti } = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60, // 15 minutes in seconds
        };
    }

    /**
     * Refresh tokens - sliding window mechanism
     * Rotates refresh token and extends expiry
     */
    async refresh(oldRefreshToken: string): Promise<TokenPair & { refreshToken: string }> {
        // Find and validate refresh token
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: oldRefreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (storedToken.revokedAt) {
            // Token was revoked - possible token theft, revoke all tokens for this user
            await this.revokeAllUserTokens(storedToken.userId);
            throw new UnauthorizedException('Refresh token has been revoked');
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token has expired');
        }

        // Rotate: revoke old token
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });

        // Generate new token pair (sliding window - new 7-day expiry)
        const { token: accessToken } = this.generateAccessToken(storedToken.user);
        const newRefreshToken = await this.generateRefreshToken(storedToken.userId);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: 15 * 60,
        };
    }

    /**
     * Logout - blacklist access token and revoke refresh token
     */
    async logout(accessToken: string, refreshToken?: string): Promise<void> {
        // Decode and blacklist access token
        try {
            const decoded = this.jwtService.decode(accessToken) as TokenPayload;
            if (decoded?.jti) {
                // Calculate remaining TTL
                const exp = (this.jwtService.decode(accessToken) as any).exp;
                const remainingSeconds = exp - Math.floor(Date.now() / 1000);
                if (remainingSeconds > 0) {
                    await this.tokenBlacklist.blacklist(decoded.jti, remainingSeconds);
                }
            }
        } catch (e) {
            // Token already invalid, proceed
        }

        // Revoke refresh token if provided
        if (refreshToken) {
            await this.prisma.refreshToken.updateMany({
                where: { token: refreshToken },
                data: { revokedAt: new Date() },
            });
        }
    }

    /**
     * Revoke all refresh tokens for a user (security measure)
     */
    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    /**
     * Check if access token is blacklisted
     */
    async isTokenBlacklisted(jti: string): Promise<boolean> {
        return this.tokenBlacklist.isBlacklisted(jti);
    }

    async register(data: { email: string; password: string; name?: string }) {
        // Check if email already exists
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            throw new UnauthorizedException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: 'CUSTOMER', // Default role for new registrations
            },
        });
    }
}
