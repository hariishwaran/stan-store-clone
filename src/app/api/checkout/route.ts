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

    // Mock checkout session for development
    const session = await createCheckoutSession({
      priceId,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cancel`,
      customerEmail,
      metadata,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 