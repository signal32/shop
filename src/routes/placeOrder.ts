import type { Handler } from "express"

// Takes an 'order', and places it in 'pending' by creating a stripe session to collect payment
// In future i may consider having multiple payment providers and this is where one would need to be chosen.
export const placeOrder: Handler = (req, res, next) => {
    next("Not implemented")
}
