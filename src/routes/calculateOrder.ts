import type { PostHandler } from "#src/handler.ts"
import { isOrder, iterOrderProducts, type Option, type Order } from "#src/order.ts"
import type { Product } from "#src/product.ts"
import { STRIPE } from "#src/stripe.ts"
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

async function calculateOrderTotals(order: Order) {
    const linePrices = await Promise.all(iterOrderProducts(order).map(async ({ product, option, optionId }) => {
        const quantity = option.quantity
        let unitPrice = await getProductPrice(product, option)
        const linePrice = unitPrice * quantity

        return { unitPrice, linePrice, productId: product.id, optionId }
    }))

    const totalPrice = linePrices.reduce((total, { linePrice }) => total + linePrice, 0)

    return { linePrices, totalPrice }
}
