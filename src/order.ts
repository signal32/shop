import type { Client } from './database/client.ts'
import { isProduct, type Product } from './product.ts'

export const createSelect = (client: Client) => {
    return client
        .from('orders')
        .select(`
            id,
            products:order_products (
                product:products ( * ),
                quantity
            )
        `)
}

export type ProductId = Product['id']

export const DEFAULT_OPTION = 'default' as const
export type OptionId = typeof DEFAULT_OPTION | string

export type Option = {
    quantity: number,
    //TODO: arbitrarily variant options
}

export type Options = Record<OptionId, Option>

export type Order = {
    id: string;
    products: Record<ProductId, {
        product: Product,
        options: Options,
    }>;
}

export function isOrder(value: unknown): value is Order {
    return (
        typeof value === 'object'
        && value !== null
        && (
            'id' in value
            && typeof value.id === 'string'
        )
        && (
            'products' in value
            && typeof value.products === 'object'
            && Object.values(value.products).every(isProduct)
        )
    )
}

export function updateOrderProductOption(
    option: Option | ((current: Option) => Option),
    order: Order,
    productId: ProductId,
    optionId: OptionId = DEFAULT_OPTION
) {
    const orderProduct = order.products[productId]
    if (!orderProduct) throw new Error('Product not in order')
    orderProduct.options[optionId] = typeof option === 'function' ? option(orderProduct.options[optionId]) : option
}

export function getOrderOption(
    order: Order,
    productId: ProductId,
    optionId: OptionId = DEFAULT_OPTION
) {
    const product = order.products[productId].product
    if (!product) throw new Error('Product does not exist')
    const option = order.products[productId].options[optionId]
    if (!option) throw new Error('Option does not exist')
    return { product, option }
}

export function* iterOrderProducts(order: Order) {
    for (const { product, options } of Object.values(order.products)) {
        for (const [optionId, option] of Object.entries(options)) {
            yield { product, option, optionId }
        }
    }
}
