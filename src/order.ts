import type { Client } from './database/client.ts'
import { isProduct, type Options, type Product } from './product.ts'

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

export type ConfigId = string

export function configId({ options }: Config) {
    return fnv1a(JSON.stringify({ options }))
}

function fnv1a(str) {
    let hash = 0x811c9dc5; // FNV offset basis

    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0; // FNV prime
    }

    return hash.toString(16);
}

export type Config = {
    quantity: number,
    options: Options,
    meta: Record<string, string>
}

export type Configs = Record<ConfigId, Config>

export type Order = {
    id: string;
    products: Record<ProductId, {
        product: Product,
        configs: Configs,
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

export function updateOrderProductConfig(
    config: Config | ((current: Config) => Config),
    order: Order,
    productId: ProductId,
    configId: ConfigId = DEFAULT_CONFIG
) {
    const orderProduct = order.products[productId]
    if (!orderProduct) throw new Error('Product not in order')
    orderProduct.configs[configId] = typeof config === 'function' ? config(orderProduct.configs[configId]) : config
}

export function getOrderConfig(
    order: Order,
    productId: ProductId,
    configId: ConfigId = DEFAULT_CONFIG
) {
    const product = order.products[productId].product
    if (!product) throw new Error('Product does not exist')
    const config = order.products[productId].configs[configId]
    if (!config) throw new Error('Config does not exist')
    return { product, config }
}

export function* iterOrderProducts(order: Order) {
    for (const { product, configs } of Object.values(order.products)) {
        for (const [optionId, config] of Object.entries(configs)) {
            yield { product, config, optionId }
        }
    }
}
