import type { components } from './schema.d.ts'

export type Config = components['schemas']['Config']
export type Order = components['schemas']['Order']

export function updateOrderProductConfig(
    config: Config | ((current: Config) => Config),
    order: Order,
    productId: string,
    configId: string
) {
    const orderProduct = order.products[productId]
    if (!orderProduct) throw new Error('Product not in order')
    orderProduct.configs[configId] = typeof config === 'function' ? config(orderProduct.configs[configId]) : config
}

export function getOrderConfig(
    order: Order,
    productId: string,
    configId: string
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
