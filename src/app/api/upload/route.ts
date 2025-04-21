// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary, { UploadApiResponse } from "cloudinary";
import { v4 as uuid } from "uuid";
import { readProducts, writeProducts, Product } from "@/lib/fileDb";
import { cld } from "@/lib/cld";

const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER!;

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

    // Build eager transformations as strings
    //  - generative recolor
    //  - apply watermark layer
    //  - auto format & quality
    const eager = colors.map((c) =>
        [
            `e_gen_recolor:prompt_tshirt;to-color_${c}`,
            `l_${FOLDER}:watermark,g_south_east,x_20,y_20`,
            "f_auto",
            "q_auto",
        ].join("/")
    );

    // Upload original + eager transforms (async)
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.v2.uploader
            .upload_stream(
                { folder: FOLDER, eager, eager_async: true },
                (err, result) => (err ? reject(err) : resolve(result!))
            )
            .end(buffer);
    });

    // Primary thumbnail URL
    const thumb = cld
        .image(uploadResult.public_id)
        .format("auto")
        .quality("auto")
        .toURL();

    // Eagerly generated variant URLs
    const variants = (uploadResult.eager || []).map((v: { secure_url: any; }) => v.secure_url!);

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
