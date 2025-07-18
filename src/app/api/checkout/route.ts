import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      priceId,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      customerEmail,
      metadata,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Handle Stripe not configured error
    if (error instanceof Error && error.message === 'Stripe is not configured') {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 