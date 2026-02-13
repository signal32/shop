import type { PostHandler } from "#src/handler.ts"
import { isOrder, type Order } from "#src/order.ts"
import { STRIPE } from "#src/stripe.ts"

export const calculateOrder: PostHandler<
    { order: number },
    Awaited<ReturnType<typeof calculateOrderTotals>>
> = async (req, res, next) => {
    const order = req.body['order']
    if (!isOrder(order)) return next('Invalid order')

    const orderTotals = await calculateOrderTotals(order)

    return res.status(200).json(orderTotals)
}

async function calculateOrderTotals(order: Order) {
    const linePrices = await Promise.all(order.products.map(async ({ product, quantity }) => {
        let unitPrice: number = null
        if (product.stripe_price_id) {
            const stripePrice = await STRIPE.prices.retrieve(product.stripe_price_id)
            unitPrice = stripePrice.unit_amount
        }
        const linePrice = unitPrice * quantity

        return { product, quantity, unitPrice, linePrice }
    }))

    const totalPrice = linePrices.reduce((total, { linePrice }) => total + linePrice, 0)

    return { linePrices, totalPrice }
}
