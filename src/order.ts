import type { Client } from './database/client.ts'
import { isProduct } from './product.ts'

export function createSelect(client: Client) {
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

export type Order = Awaited<ReturnType<typeof createSelect>>['data'][number]

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
            && Array.isArray(value.products)
            && value.products.every(isProduct)
        )
    )
}
