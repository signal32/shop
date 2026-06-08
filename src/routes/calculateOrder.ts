import { pool } from "#src/database/client.ts"
import type { PostHandler } from "#src/handler.ts"
import { isOrder, iterOrderProducts, type Order } from "#src/order.ts"
import { isProduct } from "#src/product.ts"
import { findProductById } from "#src/queries/queries.queries.ts"
import { getProductPrice } from "./productPrice.ts"

export const calculateOrder: PostHandler<
    { order: Order },
    Awaited<ReturnType<typeof calculateOrderTotals>>
> = async (req, res, next) => {
    const order = req.body['order']
    if (!isOrder(order)) return next('Invalid order')

    const orderTotals = await calculateOrderTotals(order)

    return res.status(200).json(orderTotals)
}


export async function calculateOrderTotals(order: Order) {
    const linePrices = await Promise.all(iterOrderProducts(order).map(async ({ product: { id }, config, optionId }) => {
        const [product] = await findProductById.run({ productId: id }, pool)
        if (!isProduct(product)) throw new Error('not a product')

        const quantity = config.quantity
        const productPrice = await getProductPrice(product, config.options)
        const unitPrice = productPrice.available ? productPrice.price : NaN
        const linePrice = unitPrice * quantity

        return { unitPrice, linePrice, productId: product.id, optionId, invalid: !product.available }
    }))

    const totalPrice = linePrices.reduce((total, { linePrice }) => total + linePrice, 0)

    return { linePrices, totalPrice }
}
