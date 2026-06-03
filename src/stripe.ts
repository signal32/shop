import type { Handler } from 'express';
import { Stripe } from 'stripe';
import { pool } from './database/client.ts';
import { setOrderPaid, upsertOrder } from './queries/queries.queries.ts';
import { fulfillOrder } from './routes/fulfillOrder.ts';

process.loadEnvFile()

export const STRIPE = new Stripe(process.env['SHOP_STRIPE_KEY'])


export const webhook: Handler = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = Stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata['orderId']
            const email = session.customer_details.email
            await upsertOrder.run({
                id: orderId,
                paid: true,
                email,
            }, pool)
            await fulfillOrder(orderId);
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return res.sendStatus(400);
    }
}
