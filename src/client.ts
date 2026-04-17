import type { calculateOrder } from "./routes/calculateOrder.ts"
import { clientForStaticPostHandler } from "#src/handler.ts";
import type { productPrice } from "./routes/productPrice.ts";
import type { createStripePayment } from "./routes/createStripePayment.ts";
import type { generatePreSignedUploadUrl } from "./routes/generatePreSignedUploadUrl.ts";
import type { getOrder } from "./routes/getOrder.ts";
import type { listSignsPostHandler } from "./customSigns/listSigns.ts";

export class ShopClient {

    public readonly url: string

    constructor(url: string) {
        this.url = url
    }

    public calculateOrder = clientForStaticPostHandler<typeof calculateOrder>(
        () => `${this.url}/calculateOrder`
    )

    public productPrice = clientForStaticPostHandler<typeof productPrice>(
        () => `${this.url}/productPrice`
    )

    public createStripePayment = clientForStaticPostHandler<typeof createStripePayment>(
        () => `${this.url}/createStripePayment`
    )

    public generatePreSignedUploadUrl = clientForStaticPostHandler<typeof generatePreSignedUploadUrl>(
        () => `${this.url}/generatePreSignedUploadUrl`
    )

    public getOrder = clientForStaticPostHandler<typeof getOrder>(
        () => `${this.url}/getOrder`
    )

    public listSigns = clientForStaticPostHandler<typeof listSignsPostHandler>(
        () => `${this.url}/listSigns`
    )
}
