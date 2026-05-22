import { pool } from "#src/database/client.ts";
import type { PostHandler } from "#src/handler.ts";
import type { Order } from "#src/order.ts";
import type { Options, Product } from "#src/product.ts";
import { findOrderById, findProductsInOrder, type IFindProductsInOrderResult } from "#src/queries/queries.queries.ts";
import { s3Client } from "#src/s3.ts";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


type OrderProductInfo = {
    productId: string,
    coinfigId: string,
    fulfillmentStatus: IFindProductsInOrderResult['fulfillment_status'],
    options: Options,
    files: {
        name: string,
        productId: string,
        url: string,
    }[]
}

export const getOrder: PostHandler<
    { orderId: string },
    { paid: boolean, products: OrderProductInfo[] }
> = async (req, res, next) => {
    const { orderId } = req.body

    const [order] = await findOrderById.run({ orderId }, pool)
    if (!order) return res.status(404).send()
    const orderProducts = await findProductsInOrder.run({ orderId }, pool)
    const products: OrderProductInfo[] = []

    for (const orderProduct of orderProducts) {

        const productInfo: OrderProductInfo = {
            productId: orderProduct.product_id,
            configId: orderProduct.config_id,
            quantity: orderProduct.quantity,
            options: orderProduct.options,
            fulfillmentStatus: orderProduct.fulfillment_status,
            files: [{ productId: '', name: 'test file', url: 'http://test' }],
        }

        // TODO add type and type guard for 'files'
        for (const file of orderProduct.files.files ?? []) {
            const command = new GetObjectCommand({
                Bucket: file.bucket,
                Key: file.key,
                ResponseContentDisposition: `attachment; filename="${file.key}.zip"`
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 })
            productInfo.files.push({ url, name: file.name, productId: orderProduct.productId })
        }

        products.push(productInfo)
    }

    res.json({
        paid: order.paid,
        products
    })
}
