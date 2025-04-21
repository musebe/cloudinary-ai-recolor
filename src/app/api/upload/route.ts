// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary, { UploadApiResponse } from "cloudinary";
import { v4 as uuid } from "uuid";
import { readProducts, writeProducts, Product } from "@/lib/fileDb";
import { cld } from "@/lib/cld";

const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER!;
// Your Vercel deployment URL:
const WEBHOOK =
    process.env.CLOUDINARY_WEBHOOK_URL ??
    "https://cloudinary-ai-recolor.vercel.app/api/cloudinary/webhook";

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const file = form.get("file") as File;
    const colors = JSON.parse(form.get("colors") as string) as string[];
    const name = form.get("name");
    const price = Number(form.get("price") || 0);

    if (typeof name !== "string" || !file) {
        return NextResponse.json({ error: "Missing name or file" }, { status: 400 });
    }

    // Read the file into a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Build your eager transforms
    const eager = colors.map(c =>
        [
            `e_gen_recolor:prompt_tshirt;to-color_${c}`,
            `l_${FOLDER}:watermark,g_south_east,x_20,y_20`,
            "f_auto",
            "q_auto",
        ].join("/")
    );

    // Upload original + schedule eager transforms in the background
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
            {
                folder: FOLDER,
                eager,           // same recolor transforms
                eager_async: true,
                notification_url: WEBHOOK,
            },
            (err, result) => err ? reject(err) : resolve(result!)
        ).end(buffer);
    });

    // Build a fast thumb
    const thumb = cld
        .image(uploadResult.public_id)
        .format("auto")
        .quality("auto")
        .toURL();

    // Variants will be patched in later by your webhook handler
    const variants: string[] = [];

    // Persist product
    const product: Product = {
        id: uuid(),
        name,
        price,
        publicId: uploadResult.public_id,
        thumb,
        variants,
    };

    const all = await readProducts();
    all.push(product);
    await writeProducts(all);

    return NextResponse.json(product);
}
