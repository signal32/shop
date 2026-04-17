import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: 'auto',
    endpoint: 'https://s3.finch.hamishweir.uk',
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env['SHOP_S3_USER_UPLOADS_ACCESS_KEY'],
        secretAccessKey: process.env['SHOP_S3_USER_UPLOADS_SECRET_KEY']
    }
})
