// lib/redis.ts
import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export const getRedis = async (): Promise<RedisClientType | null> => {
    if (typeof window !== "undefined") return null;
    if (client) return client;

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        console.warn("❌ No REDIS_URL in env");
        return null;
    }

    try {
        client = createClient({ url: redisUrl });
        client.on("error", (err) => console.error("Redis Client Error", err));
        await client.connect();
        console.log("🚀 Connected to Redis");
        return client;
    } catch (err) {
        console.error("❌ Failed to connect to Redis:", err);
        return null;
    }
};
