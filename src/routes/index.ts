import { Router } from "express";
import { calculateOrder } from "./calculateOrder.ts";
import { productPrice } from "./productPrice.ts";
import { createStripePayment } from "./createStripePayment.ts";
import { generatePreSignedUploadUrl } from "./generatePreSignedUploadUrl.ts";
import { getOrder } from "./getOrder.ts";
import { signOrderFulfillmentHandler } from "#src/customSigns/fulfillSignOrder.ts";
import { postFulfillOrder } from "./fulfillOrder.ts";
import { listSignsPostHandler } from "#src/customSigns/listSigns.ts";
import { previewModelHandler } from "#src/customSigns/previewModel.ts";
import { findProducts } from "./findProducts.ts";

export default Router()
    .post('/calculateOrder', calculateOrder)
    .post('/productPrice', productPrice)
    .post('/findProducts', findProducts)
    .post('/createStripePayment', createStripePayment)
    .post('/generatePreSignedUploadUrl', generatePreSignedUploadUrl)
    .post('/fulfillOrder', postFulfillOrder)
    .post('/getOrder', getOrder)
    // Custom sign routes
    .post('/fulfillSignOrder', signOrderFulfillmentHandler)
    .post('/listSigns', listSignsPostHandler)
    .get('/previewModel/:id', previewModelHandler)
