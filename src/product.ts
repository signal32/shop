import type { Client } from './database/client.ts'
import { type Database, type Json } from './database/types.ts'

export type Product = Database['shop']['Tables']['products']['Row'] & {
    meta: ProductMeta,
    stripePriceId?: string,
    configurationOptions?: ConfigurationOptions
}

export type ProductMeta = {
    imageUrls?: string[],
    headerImageUrl: string,
}

function isProductMeta(value: unknown): value is ProductMeta {
    return (
        typeof value === 'object'
        && value !== null

        && (
            !('imageUrls' in value)
            || (
                Array.isArray(value.imageUrls)
                && value.imageUrls.every(url => typeof url === 'string')
            )
        )

        && (
            !('headerImageUrl' in value)
            || typeof value.headerImageUrl === 'string'
        )
    )
}

//TODO
export function isProduct(value: unknown): value is Product {
    return true
}

export function createSelect(client: Client) {
    return client
        .from('products')
        .select('*')
}

export function fromSelect(rows: Awaited<ReturnType<typeof createSelect>>): Product[] {
    if (rows.error) throw new Error(rows.error.message)

    return rows.data.map(row => {
        if (isProductMeta(row.meta)) {
            return { ...row, meta: row.meta, stripePriceId: row.stripe_price_id }
        }
        else throw new Error('Invalid product meta')
    })
}

export type Options = Record<string, Option>

export type Option = {
    value: string,
    hidden?: boolean,
}

export type ConfigurationOption = {
    type: 'select'
    values: string[]
} | {
    type: 'input'
    value: string
} | {
    type: 'number'
    value: number
}

export type ConfigurationOptions = Record<string, ConfigurationOption>
