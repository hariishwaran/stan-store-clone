import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

// Types for Stripe products and prices
export interface StripeProduct {
  id: string
  name: string
  description: string | null
  images: string[]
  metadata: Record<string, string>
}

export interface StripePrice {
  id: string
  product_id: string
  active: boolean
  currency: string
  unit_amount: number | null
  recurring: Stripe.Price.Recurring | null
  metadata: Record<string, string>
}

// Helper function to format price
export const formatPrice = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

// Helper function to create checkout session
export const createCheckoutSession = async (params: {
  priceId: string
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: params.metadata,
  })

  return session
}

// Helper function to create subscription
export const createSubscription = async (params: {
  priceId: string
  customerId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer: params.customerId,
    metadata: params.metadata,
  })

  return session
} 