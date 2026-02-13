import { Router } from "express";
import { calculateOrder } from "./calculateOrder.ts";

export default Router()
    .post('/calculateOrder', calculateOrder)
