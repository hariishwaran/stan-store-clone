'use client'

import ProductCard from '@/components/store/ProductCard'

// Sample data - in a real app, this would come from the database
const sampleProducts = [
  {
    id: 'prod_1',
    name: 'Complete Photography Course',
    description: 'Learn photography from basics to advanced techniques. Includes 20+ video lessons, assignments, and lifetime access.',
    price: 9900, // $99.00
    type: 'digital' as const,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    settings: {
      file_size: '2.5 GB',
      lessons: 20,
    },
  },
  {
    id: 'prod_2',
    name: '1:1 Coaching Session',
    description: 'Get personalized coaching for your business or personal goals. 60-minute session via Zoom.',
    price: 15000, // $150.00
    type: 'booking' as const,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    settings: {
      duration: 60,
      platform: 'Zoom',
    },
  },
  {
    id: 'prod_3',
    name: 'Monthly Membership',
    description: 'Join our exclusive community. Get access to weekly live calls, resources, and networking opportunities.',
    price: 4900, // $49.00
    type: 'membership' as const,
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    settings: {
      billing_cycle: 'Monthly',
      features: ['Live calls', 'Resources', 'Community'],
    },
  },
  {
    id: 'prod_4',
    name: 'Custom Brand Package',
    description: 'Need something specific? Let\'s discuss your requirements and create a custom solution.',
    price: 0,
    type: 'custom' as const,
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    settings: {},
  },
]

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">John's Digital Store</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Welcome to my digital store! Here you'll find courses, coaching sessions, and resources to help you grow.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeId="sample"
            />
          ))}
        </div>
      </div>

      {/* Store Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 John's Digital Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
} 