import { type Options, type Product } from "#src/product.ts";
import { STRIPE } from "#src/stripe.ts";
import type { OpenApiRouter } from "./router.ts";

export function useOpenApiRouter(openApiRouter: OpenApiRouter) {
    openApiRouter.post('/productPrice', {
        async handler(req, res) {
            const { product, config } = req.body
            const price = await getProductPrice(product, config?.options)
            res.status(200).json(price)
        }
    })
}

export async function getProductPrice(product: Product, options?: Options) {
    if (!product) {
        return {
            price: NaN,
            available: false,
        }
    }
    if (product.stripePriceId) {
        const stripePrice = await STRIPE.prices.retrieve(product.stripePriceId)
        return {
            price: stripePrice.unit_amount,
            available: stripePrice.active,
        }
    }
    else return {
        price: NaN,
        available: false,
    }
}
