import type { PostHandler } from "#src/handler.ts";
import { s3Client } from "#src/s3.ts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generatePreSignedUploadUrl: PostHandler<
    { filename: string, type: string },
    { url: string }
> = async (req, res, next) => {
    const command = new PutObjectCommand({
        Bucket: 'shop-user-uploads',
        Key: req.body.filename,
        ContentType: req.body.type,
    })

    const url = await getSignedUrl(s3Client, command)
    return res.status(200).json({ url })
}
