# StanStore Clone

A 1:1 clone of Stan.Store - a no-code, link-in-bio e-commerce platform for creators to sell digital products, courses, coaching, and memberships.

## 🚀 Features

### Core Features
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Store Management**: Create and manage multiple stores
- **Product Types**: Support for digital downloads, bookings, memberships, and custom offers
- **Payment Processing**: Stripe integration for secure payments
- **Mobile-Optimized**: Perfect for link-in-bio usage
- **Analytics Dashboard**: Track sales and customer data

### Product Types Supported
- **Digital Downloads**: PDFs, videos, audio files
- **1:1 Bookings**: Calendly-style scheduling with payments
- **Memberships**: Recurring subscriptions via Stripe
- **Custom Offers**: "DM for pricing" style products

### Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe API
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stan-store-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Run the following SQL in your Supabase SQL editor:

```sql
-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  custom_domain TEXT,
  stripe_account_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  theme JSONB,
  settings JSONB,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in cents
  type TEXT NOT NULL, -- 'digital', 'booking', 'membership', 'custom'
  settings JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  product_id UUID REFERENCES products(id),
  customer_email TEXT,
  customer_name TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'paid', 'failed', 'refunded'
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own stores" ON stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stores" ON stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stores" ON stores FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Products are viewable by all" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage products in own stores" ON products FOR ALL USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view orders for own stores" ON orders FOR SELECT USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);
CREATE POLICY "Orders can be inserted by anyone" ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view subscriptions for own stores" ON subscriptions FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()))
);
```

### 5. Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks in the Stripe Dashboard:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── signin/           # Authentication pages
│   ├── signup/
│   └── store/            # Store pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   └── store/            # Store components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
└── types/                # TypeScript types
```

## 🔧 Key Components

### Authentication
- `AuthContext`: Manages user authentication state
- `SignInForm`: User sign-in form
- `SignUpForm`: User registration form

### Store Management
- `ProductCard`: Displays individual products
- `Navigation`: Main navigation component
- `DashboardPage`: User dashboard

### Payment Integration
- `stripe.ts`: Stripe client configuration
- `/api/checkout`: Checkout session creation
- `/api/webhooks/stripe`: Payment webhook handling

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key
STRIPE_SECRET_KEY=your_production_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_production_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔒 Security Features

- **PCI Compliance**: All payments processed through Stripe
- **Row Level Security**: Database-level security with Supabase
- **Input Validation**: Form validation with Zod
- **CSRF Protection**: Built-in Next.js protection
- **Secure Headers**: Automatic security headers

## 📈 Analytics & Tracking

- Sales tracking
- Conversion rates
- Customer data export
- Revenue analytics
- Order management

## 🎨 Customization

### Themes
The platform supports custom themes through JSON configuration:

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#6B7280",
    "background": "#FFFFFF"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  }
}
```

### Templates
Pre-designed templates for different use cases:
- Service-based stores
- Digital product stores
- Membership sites
- Coaching businesses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔄 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Authentication
- [x] Basic layout

### Phase 2: Store Management 🚧
- [ ] Store creation
- [ ] Product management
- [ ] File uploads

### Phase 3: Drag & Drop Builder 📋
- [ ] Drag & drop interface
- [ ] Templates
- [ ] Theme customization

### Phase 4: Advanced Features 📋
- [ ] Booking system
- [ ] Email marketing
- [ ] Analytics dashboard

### Phase 5: Marketing Tools 📋
- [ ] Discount codes
- [ ] Social integration
- [ ] SEO optimization
