import { Router } from "express";
import { calculateOrder } from "./calculateOrder.ts";
import { productPrice } from "./productPrice.ts";

export default Router()
    .post('/calculateOrder', calculateOrder)
    .post('/productPrice', productPrice)
