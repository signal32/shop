import type { findProductById, IFindProductByIdResult } from './queries/queries.queries.ts'

export type Product = IFindProductByIdResult & {
    meta: ProductMeta,
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

export function fromSelect(rows: Awaited<ReturnType<typeof findProductById.run>>): Product[] {
    return rows.map(row => {
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
