# 🚀 Quick Supabase Setup

## Your Supabase Project Details
- **Project ID**: `vswfiwxfwapaicgxdvov`
- **URL**: `https://vswfiwxfwapaicgxdvov.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd2Zpd3hmd2FwYWljZ3hkdm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTI3NzQsImV4cCI6MjA3MjA4ODc3NH0.WCHAgvJBjrWj7v77zGKkKJ9Ecg979CaFiSphaoMWq_U`

## Step 1: Set Up Database Schema

1. Go to [https://supabase.com/dashboard/project/vswfiwxfwapaicgxdvov](https://supabase.com/dashboard/project/vswfiwxfwapaicgxdvov)

2. Navigate to **SQL Editor** in the left sidebar

3. Click **"New Query"**

4. Copy and paste the entire contents of `supabase-schema.sql` file

5. Click **"Run"** to execute the schema

## Step 2: Verify Setup

After running the schema, you should see:
- ✅ Products table created with sample data
- ✅ Orders table created
- ✅ Order items table created
- ✅ Indexes and triggers created
- ✅ Row Level Security enabled

## Step 3: Test the Integration

1. Your development server is already running at `http://localhost:8080`
2. Visit the site and check if products load from Supabase
3. Try adding items to cart and proceeding to checkout
4. Test the admin panel at `/admin` with:
   - Email: `admin@saltnsoul.com`
   - Password: `admin123`

## Step 4: Production Deployment

Once you've verified everything works locally:

1. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set the same environment variables in Netlify dashboard
   - Deploy

2. **Set up Stripe webhooks** (optional):
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Environment Variables for Netlify

Set these in your Netlify dashboard:

```env
VITE_SUPABASE_URL=https://vswfiwxfwapaicgxdvov.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd2Zpd3hmd2FwYWljZ3hkdm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTI3NzQsImV4cCI6MjA3MjA4ODc3NH0.WCHAgvJBjrWj7v77zGKkKJ9Ecg979CaFiSphaoMWq_U
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51RK7opD6oD826RgLoI2UBB4CQUrRWPnyh3a9nXtporiaAKkmchSPdnzHIWL37wuLgYTf6bWjazd8MS41HKr0p7cf00hfsCPtvo
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## ⚠️ Important Notes

1. **Stripe Secret Key**: You'll need to add your Stripe secret key to Netlify environment variables for the payment functions to work in production.

2. **Live Mode**: You're using Stripe live mode keys, so real payments will be processed. Make sure to test thoroughly before going live.

3. **Database**: The schema includes sample products. You can modify or add products through the admin panel.

## 🎉 You're Ready!

Your e-commerce platform is now configured with real production services and ready to accept real customers! 