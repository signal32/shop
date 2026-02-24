import type { PostHandler } from "#src/handler.ts"
import { isOrder, iterOrderProducts, type Order } from "#src/order.ts"
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
    const linePrices = await Promise.all(iterOrderProducts(order).map(async ({ product, option, optionId }) => {
        const quantity = option.quantity
        let unitPrice = await getProductPrice(product, option.configuration)
        const linePrice = unitPrice * quantity

        return { unitPrice, linePrice, productId: product.id, optionId }
    }))

    const totalPrice = linePrices.reduce((total, { linePrice }) => total + linePrice, 0)

    return { linePrices, totalPrice }
}
