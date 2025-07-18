# Stan.Store Clone - Development Plan

## Project Overview
A 1:1 clone of Stan.Store - a no-code, link-in-bio e-commerce platform for creators to sell digital products, courses, coaching, and memberships.

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe API
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Hosting**: Vercel

## Architecture

### Database Schema (Supabase)
```sql
-- Users table (extends Supabase auth)
users (
  id uuid references auth.users,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  custom_domain text,
  stripe_account_id text,
  created_at timestamp
)

-- Stores table
stores (
  id uuid primary key,
  user_id uuid references users(id),
  name text,
  description text,
  theme jsonb,
  settings jsonb,
  is_published boolean default false,
  created_at timestamp
)

-- Products table
products (
  id uuid primary key,
  store_id uuid references stores(id),
  name text,
  description text,
  price integer, -- in cents
  type text, -- 'digital', 'booking', 'membership', 'custom'
  settings jsonb,
  is_active boolean default true,
  created_at timestamp
)

-- Orders table
orders (
  id uuid primary key,
  store_id uuid references stores(id),
  product_id uuid references products(id),
  customer_email text,
  customer_name text,
  amount integer,
  status text, -- 'pending', 'paid', 'failed', 'refunded'
  stripe_payment_intent_id text,
  created_at timestamp
)

-- Subscriptions table
subscriptions (
  id uuid primary key,
  order_id uuid references orders(id),
  stripe_subscription_id text,
  status text,
  current_period_end timestamp,
  created_at timestamp
)
```

## Development Phases

### Phase 1: Foundation & Authentication (Week 1)
- [x] Project setup with Next.js + TypeScript + Tailwind
- [ ] Supabase integration
- [ ] User authentication (sign up, sign in, profile)
- [ ] Basic layout and navigation
- [ ] Environment configuration

### Phase 2: Store Management (Week 2)
- [ ] Store creation and editing
- [ ] Product management (CRUD operations)
- [ ] Basic storefront display
- [ ] File upload for product assets

### Phase 3: Drag & Drop Store Builder (Week 3)
- [ ] Drag & drop interface using @dnd-kit
- [ ] Pre-designed templates
- [ ] Theme customization
- [ ] Mobile-responsive design

### Phase 4: Payment Integration (Week 4)
- [ ] Stripe integration
- [ ] Checkout flow
- [ ] Payment webhooks
- [ ] Order management

### Phase 5: Advanced Features (Week 5)
- [ ] Booking system (Calendly-style)
- [ ] Membership/subscription handling
- [ ] Analytics dashboard
- [ ] Email collection

### Phase 6: Marketing & Polish (Week 6)
- [ ] Discount codes
- [ ] Social media integration
- [ ] SEO optimization
- [ ] Performance optimization

## Key Components

### 1. Store Builder
- Drag & drop interface
- Template system
- Real-time preview
- Mobile optimization

### 2. Product Types
- **Digital Downloads**: PDF, video, audio files
- **Bookings**: Calendar integration with payments
- **Memberships**: Recurring subscriptions
- **Custom Offers**: "DM for pricing" style

### 3. Payment Flow
- Stripe Checkout integration
- Webhook handling for payment status
- Automatic tax calculation
- Payout management

### 4. Analytics
- Sales tracking
- Conversion rates
- Customer data export
- Revenue analytics

## Security Considerations
- PCI compliance via Stripe
- Secure file uploads
- Rate limiting
- Input validation
- CSRF protection

## Performance Optimization
- Image optimization
- Code splitting
- Caching strategies
- CDN integration

## Deployment Strategy
- Vercel for hosting
- Supabase for backend
- Custom domain support
- SSL certificates 