import { Router } from "express";
import { signOrderFulfillmentHandler } from "./fulfillSignOrder.ts";
import { previewModelHandler } from "./previewModel.ts";

export const router = Router()
    .post('/fulfillSignOrder', signOrderFulfillmentHandler)
    .get('/previewModel/:id', previewModelHandler)
