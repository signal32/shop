import { pool } from '#src/database/client.ts';
import { clientForPostHandler, type PostHandler } from '#src/handler.ts';
import { findOrderById, findProductById, findProductsInOrder, upsertOrderProduct } from '#src/queries/queries.queries.ts';
import { fromSelect, type Product } from '#src/product.ts';
import type { Config } from '#src/order.ts';
import { Resend } from 'resend'

process.loadEnvFile()
const resend = new Resend(process.env['SHOP_RESEND_API_KEY']);

export type FulfillmentHandlerReqBody = {
    product: Product,
    config: Config,
    orderId: string,
}

export type FulfillmentHandlerResBody = {
    files?: {
        key: string,
        bucket: string,
        name: string,
    }[]
}

export type FulfillmentHandler = PostHandler<FulfillmentHandlerReqBody, FulfillmentHandlerResBody>
export const fulfillmentHandlerClient = clientForPostHandler<FulfillmentHandler>()


export const postFulfillOrder: PostHandler<
    { orderId },
    {}
> = async (req, res, next) => {
    try {
        await fulfillOrder(req.body.orderId)
        res.status(200).send()
    }
    catch (err) {
        res.status(500).json({ error: err.toString() })
    }
}

export async function fulfillOrder(orderId: string) {
    const [order] = await findOrderById.run({ orderId }, pool)
    if (!order.paid) throw new Error('Order not paid')

    if (order.email) {
        await resend.emails.send({
            from: 'Hamish Weir Shop <shop@hamishweir.uk>',
            to: ['hdweir@outlook.com'],
            subject: 'Your order has been placed',
            html: emailHtml({
                title: 'Your order has been placed',
                content: `
                Thank you for your order. It has now been placed and being processed.
                `,
                actions: order.url ? [{
                    title: 'View order details and downloads',
                    href: order.url
                }] : []
            }),
        });
    }

    const orderProducts = await findProductsInOrder.run({ orderId }, pool)
    for (const orderProduct of orderProducts) {
        const [product] = await findProductById.run({ productId: orderProduct.product_id }, pool).then(fromSelect)
        const orderProductKeys = {
            order_id: orderProduct.order_id,
            product_id: orderProduct.product_id,
            config_id: orderProduct.config_id,
        }

        if (product.fulfillment_webhook) {

            try {
                const result = await fulfillmentHandlerClient(product.fulfillment_webhook, {
                    config: {
                        meta: orderProduct.meta,
                        options: orderProduct.options,
                        quantity: orderProduct.quantity,
                    },
                    product,
                    orderId,
                })


                await upsertOrderProduct.run({
                    ...orderProductKeys,
                    fulfillment_status: 'fulfilled',
                    ...(result.files ? {
                        // this is stupid but it seems the array must be wrapped in an object
                        files: { files: result.files }
                    } : {})
                }, pool)
            }
            catch (err) {
                await upsertOrderProduct.run({
                    ...orderProductKeys,
                    fulfillment_status: 'failed',
                }, pool)
            }
        }
        else {
            await upsertOrderProduct.run({
                ...orderProductKeys,
                fulfillment_status: 'fulfilled'
            }, pool)
        }
    }
}


function emailHtml(config: {
    title: string,
    content: string,
    actions?: { href: string, title: string }[]
}) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

        <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background-color:#f4f4f4;"
        >
            <tr>
                <td align="center" style="padding:40px 20px;">

                    <!-- Main Container -->
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
                           style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px;">

                        <!-- Header Image -->
                        <tr>
                            <td align="center" style="padding:20px 0;">
                                <img src="https://s3.finch.hamishweir.uk/shop-public/logo.png"
                                    alt="Hamish Weir Shop"
                                    width="300"
                                    style="
                                        display:block;
                                        width:300px;
                                        max-width:80%;
                                        height:auto;
                                        border:0;
                                        margin:0 auto;
                                    ">
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding:40px 30px; text-align:center;">
                                <h1 style="margin:0 0 20px; color:#333333; font-size:28px;">
                                    ${config.title}
                                </h1>

                                <p style="margin:0 0 30px; color:#555555; font-size:16px; line-height:1.6;">
                                    ${config.content}
                                </p>

                                <!-- Buttons -->
                                <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        ${config.actions.map(action => `
                                            <td style="padding:5px;">
                                                <a href="${action.href}"
                                                    style="display:inline-block; background-color:#0a59e2ff; color:#ffffff;
                                                            text-decoration:none; padding:12px 20px; border-radius:4px;
                                                            font-size:14px; font-weight:bold;">
                                                    ${action.title}
                                                </a>
                                            </td>
                                        `)}
                                    </tr>
                                </table>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `
}
