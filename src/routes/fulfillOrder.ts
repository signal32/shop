import { pool } from '#src/database/client.ts';
import { clientForPostHandler, type PostHandler } from '#src/handler.ts';
import { findOrderById, findProductById, findProductsInOrder, upsertOrderProduct } from '#src/queries/queries.queries.ts';
import { fromSelect, type Product } from '#src/product.ts';
import type { Config } from '#src/order.ts';

export type FulfillmentHandlerReqBody = {
    product: Product,
    config: Config
}

export type FulfillmentHandlerResBody = {
    files?: {
        key: string,
        bucket: string,
        name: string,
    }[]
}

export type FulfillmentHandler = PostHandler<FulfillmentHandlerReqBody, FulfillmentHandlerResBody>
export const fulfillmentHandlerClient = clientForPostHandler<FulfillmentHandler>()


export const postFulfillOrder: PostHandler<
    { orderId },
    {}
> = async (req, res, next) => {
    try {
        await fulfillOrder(req.body.orderId)
        res.status(200).send()
    }
    catch (err) {
        res.status(500).json({ error: err.toString() })
    }
}

export async function fulfillOrder(orderId: string) {
    const [order] = await findOrderById.run({ orderId }, pool)
    if (!order.paid) throw new Error('Order not paid')

    const orderProducts = await findProductsInOrder.run({ orderId }, pool)
    for (const orderProduct of orderProducts) {
        const [product] = await findProductById.run({ productId: orderProduct.product_id }, pool).then(fromSelect)
        const orderProductKeys = {
            order_id: orderProduct.order_id,
            product_id: orderProduct.product_id,
            config_id: orderProduct.config_id,
        }

        if (product.fulfillment_webhook) {

            try {
                const result = await fulfillmentHandlerClient(product.fulfillment_webhook, {
                    config: {
                        meta: orderProduct.meta,
                        options: orderProduct.options,
                        quantity: orderProduct.quantity,
                    },
                    product,
                })


                await upsertOrderProduct.run({
                    ...orderProductKeys,
                    fulfillment_status: 'fulfilled',
                    ...(result.files ? {
                        // this is stupid but it seems the array must be wrapped in an object
                        files: { files: result.files }
                    } : {})
                }, pool)
            }
            catch (err) {
                await upsertOrderProduct.run({
                    ...orderProductKeys,
                    fulfillment_status: 'failed',
                }, pool)
            }
        }
        else {
            await upsertOrderProduct.run({
                ...orderProductKeys,
                fulfillment_status: 'fulfilled'
            }, pool)
        }
    }
}
