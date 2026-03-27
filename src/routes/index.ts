import { Router } from "express";
import { calculateOrder } from "./calculateOrder.ts";
import { productPrice } from "./productPrice.ts";
import { createStripePayment } from "./createStripePayment.ts";
import { generatePreSignedUploadUrl } from "./generatePreSignedUploadUrl.ts";

export default Router()
    .post('/calculateOrder', calculateOrder)
    .post('/productPrice', productPrice)
    .post('/createStripePayment', createStripePayment)
    .post('/generatePreSignedUploadUrl', generatePreSignedUploadUrl)
