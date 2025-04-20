import { cld } from "./cld";
import { generativeRecolor } from "@cloudinary/url-gen/actions/effect";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";

const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER!;

export const buildVariant = (publicId: string, color: string) =>
    cld
        .image(publicId)
        .effect(generativeRecolor("tshirt", color))
        .overlay(
            source(image(`${FOLDER}/watermark`)).position(
                new Position()
                    .gravity(compass("south_east"))   // ✅ typed gravity helper
                    .offsetX(20)
                    .offsetY(20),
            ),
        )
        .format("auto")
        .quality("auto")
        .toURL();
