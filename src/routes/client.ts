import type { calculateOrder } from "./calculateOrder.ts"
import { clientForStaticPostHandler } from "#src/handler.ts";

export class ShopClient {

    protected url: string

    constructor(url: string) {
        this.url = url
    }

    public calculateOrder = clientForStaticPostHandler<typeof calculateOrder>(() => `${this.url}/calculateOrder`)

}
