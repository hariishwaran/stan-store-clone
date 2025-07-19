'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/stripe'

interface Product {
  id: string
  name: string
  description: string
  price: number
  type: 'digital' | 'booking' | 'membership' | 'custom'
  image?: string
}

interface ProductCardProps {
  product: Product
  storeId: string
}

export default function ProductCard({ product, storeId }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    
    try {
      // Mock purchase flow for development
      console.log('Mock purchase:', { product, storeId })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      alert(`Mock purchase successful! You would receive ${product.name} via email.`)
      
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {product.image && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.type}
          </span>
        </div>
        
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Purchase Now'}
        </button>
      </div>
    </div>
  )
} 