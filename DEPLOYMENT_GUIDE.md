# 🚀 Deployment Guide - StanStore Clone

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Supabase account
- Stripe account

## Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository"
3. Name: `stan-store-clone`
4. Description: `A 1:1 clone of Stan.Store - no-code e-commerce platform`
5. Make it **Public** (for easier Vercel integration)
6. **Don't** initialize with README, .gitignore, or license
7. Click "Create repository"

### 2. Push Code to GitHub

Run these commands in your terminal:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/stan-store-clone.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository (`stan-store-clone`)
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

Your app will be deployed to: `https://stan-store-clone-YOUR_USERNAME.vercel.app`

### 4. Set Up Supabase

1. Go to [Supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to SQL Editor and run this schema:

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
  price INTEGER NOT NULL,
  type TEXT NOT NULL,
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
  status TEXT NOT NULL,
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

-- Enable RLS
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

4. Get your project URL and anon key from Settings > API

### 5. Set Up Stripe

1. Go to [Stripe.com](https://stripe.com) and create account
2. Go to Developers > API keys
3. Copy your publishable key and secret key
4. Go to Developers > Webhooks
5. Add endpoint: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
6. Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
7. Copy the webhook signing secret

### 6. Configure Environment Variables

In your Vercel project dashboard:

1. Go to Settings > Environment Variables
2. Add these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

3. Redeploy your project

### 7. Test Your Deployment

1. Visit your Vercel URL
2. Test sign up/sign in
3. Visit `/store/sample` to see the sample store
4. Test the payment flow (use Stripe test cards)

## 🎉 Your StanStore Clone is Live!

Your application is now deployed with:
- ✅ Authentication system
- ✅ Payment processing
- ✅ Mobile-optimized design
- ✅ Sample store
- ✅ Complete database setup

## 🔧 Customization

### Custom Domain
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` in environment variables

### Branding
- Update colors in `src/app/globals.css`
- Change logo in `src/components/layout/Navigation.tsx`
- Modify landing page in `src/app/page.tsx`

## 🆘 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Make sure to redeploy after adding variables
   - Check that variable names match exactly

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are applied

3. **Payment Issues**
   - Use Stripe test mode for development
   - Verify webhook endpoint is correct
   - Check webhook events are selected

### Support
- Check the [README.md](README.md) for detailed setup
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for features
- Open issues in the GitHub repository

## 🚀 Next Steps

After deployment, consider:
1. Adding custom domains
2. Setting up email notifications
3. Implementing the drag-and-drop builder
4. Adding analytics tracking
5. Creating custom themes

Your StanStore clone is ready to use! 🎉 