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

  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database is not configured' },
      { status: 503 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { metadata, customer_email, amount_total, payment_intent } = session

  if (!metadata?.productId || !metadata?.storeId) {
    console.error('Missing metadata in checkout session')
    return
  }

  // Create order record
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      store_id: metadata.storeId,
      product_id: metadata.productId,
      customer_email: customer_email || '',
      customer_name: session.customer_details?.name || '',
      amount: amount_total || 0,
      status: 'paid',
      stripe_payment_intent_id: payment_intent as string,
    })

  if (orderError) {
    console.error('Error creating order:', orderError)
    return
  }

  // Handle different product types
  if (customer_email) {
    switch (metadata.productType) {
      case 'digital':
        await handleDigitalProductDelivery(metadata.productId, customer_email)
        break
      case 'booking':
        await handleBookingConfirmation(metadata.productId, customer_email)
        break
      case 'membership':
        await handleMembershipActivation(metadata.productId, customer_email)
        break
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // For subscription invoices, the subscription ID is in the subscription field
  const subscriptionId = (invoice as any).subscription
  if (subscriptionId && typeof subscriptionId === 'string') {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: new Date(invoice.period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // For subscription invoices, the subscription ID is in the subscription field
  const subscriptionId = (invoice as any).subscription
  if (subscriptionId && typeof subscriptionId === 'string') {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
      })
      .eq('stripe_subscription_id', subscriptionId)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Update subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleDigitalProductDelivery(productId: string, customerEmail: string) {
  // In a real app, you would:
  // 1. Generate a secure download link
  // 2. Send email with download instructions
  // 3. Track download analytics
  
  console.log(`Digital product delivery for ${productId} to ${customerEmail}`)
  
  // Example: Send email with download link
  // await sendDownloadEmail(customerEmail, productId)
}

async function handleBookingConfirmation(productId: string, customerEmail: string) {
  // In a real app, you would:
  // 1. Create calendar event
  // 2. Send confirmation email with meeting details
  // 3. Update booking status
  
  console.log(`Booking confirmation for ${productId} to ${customerEmail}`)
  
  // Example: Send booking confirmation email
  // await sendBookingConfirmationEmail(customerEmail, productId)
}

async function handleMembershipActivation(productId: string, customerEmail: string) {
  // In a real app, you would:
  // 1. Add user to membership group/community
  // 2. Send welcome email with access details
  // 3. Update membership status
  
  console.log(`Membership activation for ${productId} to ${customerEmail}`)
  
  // Example: Send membership welcome email
  // await sendMembershipWelcomeEmail(customerEmail, productId)
} 