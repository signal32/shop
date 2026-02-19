import type { PostHandler } from "#src/handler.ts";
import { iterOrderProducts, type Order } from "#src/order.ts";
import { STRIPE } from "#src/stripe.ts";
import type { Handler } from "express"

const YOUR_DOMAIN = 'http://localhost:4242';

export const createStripePayment: PostHandler<
    { order: Order },
    { url: string }
> = async (req, res, next) => {
    const { order } = req.body

    const session = await STRIPE.checkout.sessions.create({
        line_items: iterOrderProducts(order).map(({ product, option }) => ({
            price: product.stripePriceId,
            quantity: option.quantity
        })).toArray(),
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
    });
    return res.status(200).json({ url: session.url })
}
