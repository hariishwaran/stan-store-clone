// Mock Stripe client for development without Stripe
export const stripePromise = Promise.resolve({
  redirectToCheckout: async () => ({ error: null }),
  confirmPayment: async () => ({ error: null }),
  confirmCardPayment: async () => ({ error: null })
});

export const stripe = {
  checkout: {
    sessions: {
      create: async () => ({
        id: 'mock_session_123',
        url: 'https://example.com/mock-checkout'
      })
    }
  },
  webhooks: {
    constructEvent: () => ({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'mock_session_123',
          customer_email: 'customer@example.com',
          amount_total: 2000,
          metadata: {}
        }
      }
    })
  }
};

// Types for Stripe products and prices
export interface StripeProduct {
  id: string
  name: string
  description: string | null
  active: boolean
  created: number
  updated: number
}

export interface StripePrice {
  id: string
  product: string
  active: boolean
  currency: string
  unit_amount: number
  recurring: {
    interval: string
    interval_count: number
  } | null
  created: number
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
  return {
    id: 'mock_session_123',
    url: 'https://example.com/mock-checkout'
  }
}

// Helper function to create subscription
export const createSubscription = async (params: {
  priceId: string
  customerId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) => {
  return {
    id: 'mock_subscription_123',
    url: 'https://example.com/mock-subscription'
  }
} 