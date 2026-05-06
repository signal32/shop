import { pool } from "#src/database/client.ts";
import type { PostHandler } from "#src/handler.ts";
import type { Config, ProductId } from "#src/order.ts";
import { fromSelect, type Options, type Product } from "#src/product.ts";
import { findProductById } from "#src/queries/queries.queries.ts";
import { STRIPE } from "#src/stripe.ts";

export const productPrice: PostHandler<
    { productId: ProductId, config?: Config },
    { price: number }
> = async (req, res, next) => {
    const { productId, config } = req.body
    if (productId === undefined) throw new Error('Product ID required')

    const [product] = await findProductById.run({ productId }, pool).then(fromSelect)
    const price = await getProductPrice(product, config?.options)
    res.status(200).json({ price })
}

export async function getProductPrice(product: Product, options?: Options) {
    let price = 0

    if (product.stripe_price_id) {
        const stripePrice = await STRIPE.prices.retrieve(product.stripe_price_id)
        price = stripePrice.unit_amount
    }

    return price
}
