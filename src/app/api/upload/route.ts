import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { v4 as uuid } from "uuid";
import { buildVariant } from "@/lib/buildVariant";
import { readProducts, writeProducts, Product } from "@/lib/fileDb";
import { cld } from "@/lib/cld";// browser+node Cloudinary helper

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

    if (typeof name !== "string" || !file)
        return NextResponse.json({ error: "Missing name or file" }, { status: 400 });

    /* upload original ------------------------------------------------------- */
    const arrayBuffer = await file.arrayBuffer();

    const { public_id } = await new Promise<cloudinary.UploadApiResponse>(
        (res, rej) =>
            cloudinary.v2.uploader
                .upload_stream({ folder: FOLDER }, (err, r) => (err ? rej(err) : res(r!)))
                .end(Buffer.from(arrayBuffer)),
    );

    /* build variant + thumbnail URLs --------------------------------------- */
    const thumb = cld.image(public_id).format("auto").quality("auto").toURL();
    const variants = colors.map((c) => buildVariant(public_id, c));

    /* persist to the file “DB” --------------------------------------------- */
    const product: Product = {
        id: uuid(),
        name,
        price,
        publicId: public_id,
        thumb,
        variants,
    };

    const all = await readProducts();
    all.push(product);
    await writeProducts(all);

    return NextResponse.json(product);
}
