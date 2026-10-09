import type { PostHandler } from "#src/handler.ts";
import { iterOrderProducts, type Order } from "#src/order.ts";
import { STRIPE } from "#src/stripe.ts";
import { pool } from "#src/database/client.ts";
import { upsertOrder, upsertOrderProduct } from "#src/queries/queries.queries.ts";
import type { OpenApiRouter } from "./router.ts";

export function useOpenApiRouter(openApiRouter: OpenApiRouter) {
    openApiRouter.post('/createStripePayment', {
        async handler(req, res) {
            const { order, successUrl, url } = req.body

            await upsertOrder.run({ id: order.id, url }, pool)
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
                    price: product.stripePriceId,
                    quantity: config.quantity,
                })).toArray(),
                mode: 'payment',
                success_url: successUrl,
                metadata: {
                    orderId: order.id,
                    successUrl: successUrl,
                },
                payment_intent_data: {
                    description: `View your order online and download purchased files at: ${successUrl}`
                },
                allow_promotion_codes: true,
            });

            return void res.status(200).json({ url: session.url })
        }
    })
}

export const createStripePayment: PostHandler<
    { order: Order, successUrl: string, url?: string },
    { url: string }
> = async (req, res, next) => {

}
