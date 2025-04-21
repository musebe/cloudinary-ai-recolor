// lib/redis.ts
import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType | null = null;

export const getRedis = async (): Promise<RedisClientType | null> => {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl || typeof window !== 'undefined') return null;

    if (!redis) {
        redis = createClient({ url: redisUrl });
        redis.on('error', (err) => console.error('❌ Redis error:', err));
        await redis.connect();
    }

    if (!redis.isOpen) {
        await redis.connect();
    }

    return redis;
};
