import { promises as fs } from "fs";
import path from "path";

const file = path.join(process.cwd(), "data", "products.json");

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
        return raw.trim() ? JSON.parse(raw) : [];       // ← empty file ⇒ []
    } catch {
        return [];                                      // ← file missing ⇒ []
    }
};

export const writeProducts = async (all: Product[]) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(all, null, 2));
};
