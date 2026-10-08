import { Router } from "express";
import { signOrderFulfillmentHandler } from "./fulfillSignOrder.ts";
import { listSignsPostHandler } from "./listSigns.ts";
import { previewModelHandler } from "./previewModel.ts";

export const router = Router()
    .post('/fulfillSignOrder', signOrderFulfillmentHandler)
    .post('/listSigns', listSignsPostHandler)
    .get('/previewModel/:id', previewModelHandler)
