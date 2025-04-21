import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { getRedis } from "./redis"; // ← change here

const isVercel = !!process.env.VERCEL;
const file = isVercel
    ? path.join(os.tmpdir(), "products.json")
    : path.join(process.cwd(), "data", "products.json");

export type Product = {
    id: string;
    name: string;
    price: number;
    publicId: string;
    thumb: string;
    variants: string[];
};

export const readProducts = async (): Promise<Product[]> => {
    const redis = await getRedis(); // ← connect when needed
    if (redis) {
        const cached = await redis.get("products");
        if (cached) {
            console.log("🧠 Redis cache hit");
            return JSON.parse(cached);
        }
    }

    try {
        const raw = await fs.readFile(file, "utf8");
        const data = raw.trim() ? JSON.parse(raw) : [];

        if (redis) {
            await redis.set("products", JSON.stringify(data));
            console.log("📦 Synced Redis cache");
        }

        return data;
    } catch (error) {
        console.warn("⚠️ Could not read products file:", error);
        return [];
    }
};

export const writeProducts = async (all: Product[]) => {
    const redis = await getRedis(); // ← again here
    const json = JSON.stringify(all, null, 2);

    if (redis) {
        await redis.set("products", json);
        console.log("✅ Wrote to Redis");
        return;
    }

    try {
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, json);
        console.log("✅ Successfully wrote products file");
    } catch (error) {
        console.error("❌ Failed to write products file:", error);
    }
};
