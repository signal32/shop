import { Stripe } from 'stripe'

export const STRIPE = new Stripe(process.env['SHOP_STRIPE_KEY'])
