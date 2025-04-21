// src/app/api/cloudinary/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/fileDb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const { public_id, eager } = payload;

    if (!public_id || !Array.isArray(eager)) {
        return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const products = await readProducts();
    const idx = products.findIndex(p => p.publicId === public_id);
    if (idx === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    products[idx].variants = eager.map((e: any) => e.secure_url);
    await writeProducts(products);

    return NextResponse.json({ ok: true });
}
