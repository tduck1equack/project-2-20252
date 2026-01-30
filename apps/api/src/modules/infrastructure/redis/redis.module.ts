import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '@repo/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: () => {
                const redis = new Redis({
                    host: env.REDIS_HOST,
                    port: env.REDIS_PORT,
                    maxRetriesPerRequest: 3,
                });

                redis.on('error', (err) => {
                    console.error('Redis connection error:', err);
                });

                redis.on('connect', () => {
                    console.log('🔴 Redis connected');
                });

                return redis;
            },
        },
    ],
    exports: [REDIS_CLIENT],
})
export class RedisModule { }
