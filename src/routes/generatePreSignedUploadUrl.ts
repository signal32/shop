import type { PostHandler } from "#src/handler.ts";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generatePreSignedUploadUrl: PostHandler<
    { filename: string, type: string },
    { url: string }
> = async (req, res, next) => {
    const client = new S3Client({
        region: 'auto',
        endpoint: 'https://s3.finch.hamishweir.uk',
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env['SHOP_S3_USER_UPLOADS_ACCESS_KEY'],
            secretAccessKey: process.env['SHOP_S3_USER_UPLOADS_SECRET_KEY']
        }
    })

    const command = new PutObjectCommand({
        Bucket: 'shop-user-uploads',
        Key: req.body.filename,
        ContentType: req.body.type,
    })

    const url = await getSignedUrl(client, command)
    return res.status(200).json({ url })
}
