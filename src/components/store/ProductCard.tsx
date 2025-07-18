'use client'

import { useState } from 'react'
import { ShoppingCart, Download, Calendar, Users, MessageCircle } from 'lucide-react'
import { formatPrice } from '@/lib/stripe'
import { stripePromise } from '@/lib/stripe'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string | null
    price: number
    type: 'digital' | 'booking' | 'membership' | 'custom'
    image_url?: string
    settings?: any
  }
  storeId: string
}

const getProductIcon = (type: string) => {
  switch (type) {
    case 'digital':
      return <Download className="h-5 w-5" />
    case 'booking':
      return <Calendar className="h-5 w-5" />
    case 'membership':
      return <Users className="h-5 w-5" />
    case 'custom':
      return <MessageCircle className="h-5 w-5" />
    default:
      return <ShoppingCart className="h-5 w-5" />
  }
}

const getProductTypeLabel = (type: string) => {
  switch (type) {
    case 'digital':
      return 'Digital Download'
    case 'booking':
      return 'Book Session'
    case 'membership':
      return 'Join Membership'
    case 'custom':
      return 'Custom Offer'
    default:
      return 'Product'
  }
}

export default function ProductCard({ product, storeId }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    if (product.type === 'custom') {
      // For custom offers, redirect to contact or show modal
      window.open(`mailto:?subject=Inquiry about ${product.name}`, '_blank')
      return
    }

    setIsLoading(true)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.id, // This would be the Stripe price ID
          successUrl: `${window.location.origin}/success?product=${product.id}`,
          cancelUrl: `${window.location.origin}/store/${storeId}`,
          metadata: {
            productId: product.id,
            storeId,
            productType: product.type,
          },
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            {getProductIcon(product.type)}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getProductTypeLabel(product.type)}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {product.type === 'custom' ? 'Contact' : formatPrice(product.price)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Product-specific details */}
        {product.settings && (
          <div className="mb-4 text-sm text-gray-500">
            {product.type === 'digital' && product.settings.file_size && (
              <p>File size: {product.settings.file_size}</p>
            )}
            {product.type === 'booking' && product.settings.duration && (
              <p>Duration: {product.settings.duration} minutes</p>
            )}
            {product.type === 'membership' && product.settings.billing_cycle && (
              <p>Billing: {product.settings.billing_cycle}</p>
            )}
          </div>
        )}

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
            product.type === 'custom'
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              {getProductIcon(product.type)}
              <span className="ml-2">
                {product.type === 'custom' ? 'Contact for Pricing' : 'Purchase Now'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
} 