import type { PostHandler } from "#src/handler.ts";
import { iterOrderProducts, type Order } from "#src/order.ts";
import { STRIPE } from "#src/stripe.ts";
import { client, pgClient, pool } from "#src/database/clientInstance.ts";
import { upsertOrder, upsertOrderProduct } from "#src/queries/queries.queries.ts";

export const createStripePayment: PostHandler<
    { order: Order, successUrl: string },
    { url: string }
> = async (req, res, next) => {
    const { order, successUrl: sucessUrl } = req.body

    await upsertOrder.run({ id: order.id }, pool)
    for (const { product, configs } of Object.values(order.products)) {
        for (const [configId, config] of Object.entries(configs)) {
            const l = await upsertOrderProduct.run({
                order_id: order.id,
                product_id: product.id,
                config_id: configId,
                quantity: config.quantity,
                options: config.options,
                meta: config.meta,
            }, pool)
        }
    }

    const session = await STRIPE.checkout.sessions.create({
        line_items: iterOrderProducts(order).map(({ product, config }) => ({
            price: product.stripe_price_id,
            quantity: config.quantity,
        })).toArray(),
        mode: 'payment',
        success_url: sucessUrl,
        metadata: {
            orderId: order.id,
        }
    });
    return res.status(200).json({ url: session.url })
}
