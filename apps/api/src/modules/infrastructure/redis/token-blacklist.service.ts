import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

const BLACKLIST_PREFIX = 'token:blacklist:';
const ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes in seconds

@Injectable()
export class TokenBlacklistService {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    /**
     * Add a JWT access token to the blacklist
     * Token will be auto-removed after its TTL expires
     */
    async blacklist(jti: string, expiresInSeconds?: number): Promise<void> {
        const ttl = expiresInSeconds ?? ACCESS_TOKEN_TTL;
        await this.redis.setex(`${BLACKLIST_PREFIX}${jti}`, ttl, '1');
    }

    /**
     * Check if a token is blacklisted
     */
    async isBlacklisted(jti: string): Promise<boolean> {
        const result = await this.redis.get(`${BLACKLIST_PREFIX}${jti}`);
        return result !== null;
    }

    /**
     * Get remaining TTL for a blacklisted token (for debugging)
     */
    async getTTL(jti: string): Promise<number> {
        return this.redis.ttl(`${BLACKLIST_PREFIX}${jti}`);
    }
}
