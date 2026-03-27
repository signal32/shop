import { client } from "#src/database/clientInstance.ts";
import type { PostHandler } from "#src/handler.ts";
import type { Config, ProductId } from "#src/order.ts";
import { createSelect, fromSelect, type Options, type Product } from "#src/product.ts";
import { STRIPE } from "#src/stripe.ts";

export const productPrice: PostHandler<
    { productId: ProductId, option?: Config },
    { price: number }
> = async (req, res, next) => {
    const { productId, option } = req.body
    if (productId === undefined) throw new Error('Product ID required')

    const [product] = await createSelect(client)
        .eq('id', productId)
        .then(fromSelect)

    const price = await getProductPrice(product, option?.configuration)
    res.status(200).json({ price })
}

export async function getProductPrice(product: Product, configuration?: Options) {
    let price = 0

    if (product.stripe_price_id) {
        const stripePrice = await STRIPE.prices.retrieve(product.stripe_price_id)
        price = stripePrice.unit_amount
    }

    return price
}
