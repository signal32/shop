import type { RequestHandler } from "express"

export type PostHandler<ResB, ReqB> = RequestHandler<{}, ReqB, ResB>

type ReqOf<H> = H extends PostHandler<infer Req, any> ? Req : never;
type ResOf<H> = H extends PostHandler<any, infer Res> ? Res : never;

export function clientForPostHandler<
    H extends PostHandler<any, any>
>(): (
    url: string,
    body: ReqOf<H>
) => Promise<ResOf<H>> {
    return (url, body) => {
        return fetch(url, {
            method: 'POST',
            body: body.toString()
        }) as Promise<ResOf<H>>
    }
}

export function clientForStaticPostHandler<
    H extends PostHandler<any, any>
>(url: () => string): (
    body: ReqOf<H>
) => Promise<ResOf<H>> {
    return (body) => {
        console.log('wow')
        return fetch(url(), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(result => result.json()) as Promise<ResOf<H>>
    }
}
