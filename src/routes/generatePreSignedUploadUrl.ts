import { s3Client } from "#src/s3.ts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { OpenApiRouter } from "./router.ts";

export function useOpenApiRouter(openApiRouter: OpenApiRouter) {
    openApiRouter.post('/generatePreSignedUploadUrl', {
        async handler(req, res) {
            const command = new PutObjectCommand({
                Bucket: 'shop-user-uploads',
                Key: req.body.filename,
                ContentType: req.body.type,
            })

            const url = await getSignedUrl(s3Client, command)
            return void res.status(200).json({ url })
        }
    })
}
