import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../infrastructure/redis/token-blacklist.service';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

import { TokenPayload } from '@repo/dto';

interface TokenPair {
    accessToken: string;
    expiresIn: number;
}

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepository: RefreshTokenRepository,
        private jwtService: JwtService,
        private tokenBlacklist: TokenBlacklistService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
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

        await this.refreshTokenRepository.create(userId, token, expiresAt);
        return token;
    }

    /**
     * Login - returns access token and sets refresh token
     */
    async login(user: any): Promise<TokenPair & { refreshToken: string }> {
        const { token: accessToken } = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60, // 15 minutes in seconds
        };
    }

    /**
     * Refresh tokens - sliding window mechanism
     */
    async refresh(oldRefreshToken: string): Promise<TokenPair & { refreshToken: string }> {
        const storedToken = await this.refreshTokenRepository.findByToken(oldRefreshToken);

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (storedToken.revokedAt) {
            await this.refreshTokenRepository.revokeAllForUser(storedToken.userId);
            throw new UnauthorizedException('Refresh token has been revoked');
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token has expired');
        }

        // Rotate: revoke old token
        await this.refreshTokenRepository.revokeToken(storedToken.id);

        // Generate new token pair
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
        try {
            const decoded = this.jwtService.decode(accessToken) as TokenPayload;
            if (decoded?.jti) {
                const exp = (this.jwtService.decode(accessToken) as any).exp;
                const remainingSeconds = exp - Math.floor(Date.now() / 1000);
                if (remainingSeconds > 0) {
                    await this.tokenBlacklist.blacklist(decoded.jti, remainingSeconds);
                }
            }
        } catch (e) {
            // Token already invalid
        }

        if (refreshToken) {
            const stored = await this.refreshTokenRepository.findByToken(refreshToken);
            if (stored) {
                await this.refreshTokenRepository.revokeToken(stored.id);
            }
        }
    }

    /**
     * Revoke all refresh tokens for a user
     */
    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.refreshTokenRepository.revokeAllForUser(userId);
    }

    /**
     * Check if access token is blacklisted
     */
    async isTokenBlacklisted(jti: string): Promise<boolean> {
        return this.tokenBlacklist.isBlacklisted(jti);
    }

    async register(data: { email: string; password: string; name?: string }) {
        const existing = await this.userRepository.findByEmail(data.email);

        if (existing) {
            throw new UnauthorizedException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.userRepository.create({
            email: data.email,
            password: hashedPassword,
            name: data.name,
            role: 'CUSTOMER' as any,
        });
    }
}
