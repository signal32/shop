import { Stripe } from 'stripe'

process.loadEnvFile()

export const STRIPE = new Stripe(process.env['SHOP_STRIPE_KEY'])
