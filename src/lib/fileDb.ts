import { getRedis } from "./redis";

export type Product = {
    id: string;
    name: string;
    price: number;
    publicId: string;
    thumb: string;
    variants: string[];
};

export const readProducts: () => Promise<Product[]> = async () => {
    const redis = await getRedis();
    if (!redis) {
        console.warn("⚠️ Redis unavailable. Cannot read products.");
        return [];
    }

    try {
        const cached = await redis.get("products");
        if (cached) {
            console.log("🧠 Redis cache hit");
            return JSON.parse(cached);
        }

        console.warn("📭 Redis has no products key");
        return [];
    } catch (error) {
        console.error("❌ Redis read error:", error);
        return [];
    }
};

export const writeProducts = async (all: Product[]) => {
    const redis = await getRedis();
    if (!redis) {
        console.warn("⚠️ Redis unavailable. Cannot write products.");
        return;
    }

    try {
        const json = JSON.stringify(all, null, 2);
        await redis.set("products", json);
        console.log("✅ Wrote products to Redis");
    } catch (error) {
        console.error("❌ Redis write error:", error);
    }
};
