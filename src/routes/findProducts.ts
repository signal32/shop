import { pool } from "#src/database/client.ts";
import type { PostHandler } from "#src/handler.ts";
import { fromSelect, type Product } from "#src/product.ts";
import { findProductById, findProducts as findProductsQuery } from "#src/queries/queries.queries.ts";

export const findProducts: PostHandler<
    { productIds?: string[] },
    Product[]
> = async (req, res, next) => {
    const { productIds } = req.body
    const products = await findProductsQuery.run({ productIds }, pool).then(fromSelect)
    res.status(200).json(products)
}
