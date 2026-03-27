import type { calculateOrder } from "./routes/calculateOrder.ts"
import { clientForStaticPostHandler } from "#src/handler.ts";
import type { productPrice } from "./routes/productPrice.ts";
import type { createStripePayment } from "./routes/createStripePayment.ts";
import type { generatePreSignedUploadUrl } from "./routes/generatePreSignedUploadUrl.ts";

export class ShopClient {

    protected url: string

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
}
