import { iterOrderProducts, type Order } from "#src/order.ts"
import { isProduct } from "#src/product.ts"
import type { components } from "#src/schema.js"
import cors from 'cors'
import { getProductPrice } from "./productPrice.ts"
import type { OpenApiRouter } from "./router.ts"

export function useOpenApiRouter(openApiRouter: OpenApiRouter) {
    openApiRouter.post('/calculateOrder', {
        middleware: [cors()],
        async handler(req, res) {
            const order = req.body
            const orderTotals = await calculateOrderTotals(order)
            res.status(200).json(orderTotals)
        }
    })
}

export async function calculateOrderTotals(order: Order): Promise<components['schemas']['CalculatedOrder']> {
    const linePrices = await Promise.all(iterOrderProducts(order).map(async ({ product, config, optionId }) => {
        if (!isProduct(product)) throw new Error('not a product')

        const quantity = config.quantity
        const productPrice = await getProductPrice(product, config.options)
        const unitPrice = productPrice.available ? productPrice.price : NaN
        const linePrice = unitPrice * quantity

        return { unitPrice, linePrice, productId: product.id, optionId, invalid: !productPrice.available }
    }))

    const totalPrice = linePrices.reduce((total, { linePrice }) => total + linePrice, 0)

    return { linePrices, totalPrice }
}
