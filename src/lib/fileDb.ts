import { promises as fs } from "fs";
import path from "path";
import os from "os";

const isVercel = !!process.env.VERCEL;

const file = isVercel
    ? path.join(os.tmpdir(), "products.json") // ⬅️ Writable temp dir on Vercel
    : path.join(process.cwd(), "data", "products.json"); // ⬅️ Normal path locally

console.log("📦 Product file path:", file);
console.log("🚀 Running on Vercel?", isVercel);

export type Product = {
    id: string;
    name: string;
    price: number;
    publicId: string;
    thumb: string;
    variants: string[];
};

export const readProducts = async (): Promise<Product[]> => {
    try {
        const raw = await fs.readFile(file, "utf8");
        console.log("✅ Successfully read products");
        return raw.trim() ? JSON.parse(raw) : [];
    } catch (error) {
        console.warn("⚠️ Could not read products file:", error);
        return [];
    }
};

export const writeProducts = async (all: Product[]) => {
    try {
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify(all, null, 2));
        console.log("✅ Successfully wrote products file");
    } catch (error) {
        console.error("❌ Failed to write products file:", error);
    }
};
