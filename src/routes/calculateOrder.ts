import type { PostHandler } from "#src/handler.ts"
import { isOrder, type Option, type Order } from "#src/order.ts"
import type { Product } from "#src/product.ts"
import { STRIPE } from "#src/stripe.ts"

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
    const linePrices = await Promise.all(
        Object
            .values(order.products)
            .flatMap(({ product, options }) =>
                Object
                    .entries(options)
                    .map(async ([optionId, option]) => {
                        const quantity = option.quantity
                        let unitPrice = await getProductPrice(product, option)
                        const linePrice = unitPrice * quantity

                        return { product, optionId, option, quantity, unitPrice, linePrice }
                    })
            ))

    const totalPrice = linePrices.reduce((total, { linePrice }) => total + linePrice, 0)

    return { linePrices, totalPrice }
}

async function getProductPrice(product: Product, option: Option) {
    let price = 0

    if (product.stripe_price_id) {
        const stripePrice = await STRIPE.prices.retrieve(product.stripe_price_id)
        price = stripePrice.unit_amount
    }

    return price
}
