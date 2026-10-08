import { pool } from "#src/database/client.ts";
import { findOrderById, findProductsInOrder } from "#src/queries/queries.queries.ts";
import { s3Client } from "#src/s3.ts";
import type { components } from "#src/schema.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { OpenApiRouter } from "./router.ts";

type OrderProductInfo = components['schemas']['OrderProductInfo']

export function useOpenApiRouter(openApiRouter: OpenApiRouter) {
    openApiRouter.post('/getOrder', {
        async handler(req, res) {
            const { orderId } = req.body

            const [order] = await findOrderById.run({ orderId }, pool)
            if (!order) return void res.status(404).send()

            const orderProducts = await findProductsInOrder.run({ orderId }, pool)
            const products: OrderProductInfo[] = []

            for (const orderProduct of orderProducts) {

                const productInfo: OrderProductInfo = {
                    productId: orderProduct.product_id,
                    configId: orderProduct.config_id,
                    quantity: orderProduct.quantity,
                    options: orderProduct.options as any,
                    fulfillmentStatus: orderProduct.fulfillment_status,
                    files: [],
                }

                // TODO add type and type guard for 'files'
                for (const file of (orderProduct.files as any).files ?? []) {
                    const command = new GetObjectCommand({
                        Bucket: file.bucket,
                        Key: file.key,
                        ResponseContentDisposition: `attachment; filename="${file.key}.zip"`
                    });

                    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 })
                    productInfo.files.push({ url, name: file.name, productId: orderProduct.product_id })
                }

                products.push(productInfo)
            }

            res.json({
                paid: order.paid,
                products
            })
        }
    })
}
