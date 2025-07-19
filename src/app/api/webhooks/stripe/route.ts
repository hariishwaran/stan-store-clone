import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: any

  try {
    // Mock webhook event for development
    event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'mock_session_123',
          customer_email: 'customer@example.com',
          amount_total: 2000,
          metadata: {}
        }
      }
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    // Mock webhook processing for development
    console.log('Processing webhook event:', event.type)
    
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Mock: Checkout session completed')
        break
      case 'invoice.payment_succeeded':
        console.log('Mock: Invoice payment succeeded')
        break
      case 'invoice.payment_failed':
        console.log('Mock: Invoice payment failed')
        break
      case 'customer.subscription.deleted':
        console.log('Mock: Customer subscription deleted')
        break
      default:
        console.log('Mock: Unhandled event type:', event.type)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
} 