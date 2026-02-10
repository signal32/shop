import type { Handler } from "express"

/**
 * This will fetch the purchased product, and all files etc associated with it.
 * Authorize with order id
 */
export const createStripePayment: Handler = (req, res, next) => {
    next("Not implemented")
}
