# 🚀 Production Deployment Guide

## Overview
This guide will help you deploy your SaltnSoul e-commerce platform to production using Netlify, Stripe, and Supabase.

## Prerequisites
- [Netlify Account](https://netlify.com)
- [Stripe Account](https://stripe.com)
- [Supabase Account](https://supabase.com)
- [GitHub/GitLab Account](https://github.com)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `saltnsoul-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your customers
5. Click "Create new project"

### 1.2 Set Up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the schema

### 1.3 Get API Keys
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 2: Set Up Stripe

### 2.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Switch to **Live mode** (not test mode) for production

### 2.2 Get API Keys
1. Go to **Developers** → **API Keys**
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_live_...`)
   - **Secret Key** (starts with `sk_live_...`)

### 2.3 Configure Webhooks (Optional)
1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Step 3: Deploy to Netlify

### 3.1 Connect Repository
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub/GitLab account
4. Select your SaltnSoul repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 3.2 Set Environment Variables
In your Netlify dashboard, go to **Site settings** → **Environment variables** and add:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# App Configuration
VITE_APP_NAME=SaltnSoul
VITE_APP_URL=https://your-domain.netlify.app
```

### 3.3 Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain
1. Go to **Domain settings** in Netlify
2. Click "Add custom domain"
3. Enter your domain (e.g., `saltnsoul.com`)
4. Follow DNS configuration instructions

### 4.2 Update Environment Variables
Update `VITE_APP_URL` to your custom domain.

## Step 5: Test Production Setup

### 5.1 Test Product Display
1. Visit your live site
2. Verify products are loading from Supabase
3. Test search and filtering

### 5.2 Test Payment Flow
1. Add items to cart
2. Proceed to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify order creation in Supabase

### 5.3 Test Admin Panel
1. Go to `/admin`
2. Login with: `admin@saltnsoul.com` / `admin123`
3. Test product management
4. Verify inventory updates

## Step 6: Security & Compliance

### 6.1 SSL Certificate
- Netlify provides free SSL certificates automatically
- Verify HTTPS is working

### 6.2 Privacy Policy & Terms
1. Create privacy policy page
2. Create terms of service page
3. Add links in footer

### 6.3 GDPR Compliance
1. Add cookie consent banner
2. Implement data deletion requests
3. Add privacy policy

## Step 7: Monitoring & Analytics

### 7.1 Set Up Monitoring
1. **Netlify Analytics**: Enable in dashboard
2. **Error Tracking**: Consider Sentry integration
3. **Performance**: Monitor Core Web Vitals

### 7.2 Business Analytics
1. **Google Analytics**: Add tracking code
2. **Stripe Dashboard**: Monitor payments
3. **Supabase Dashboard**: Monitor database usage

## Troubleshooting

### Common Issues

#### Products Not Loading
- Check Supabase connection in browser console
- Verify environment variables are set correctly
- Check Supabase RLS policies

#### Payment Failures
- Verify Stripe keys are correct
- Check Netlify function logs
- Ensure amount is in cents

#### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### Support Resources
- [Netlify Docs](https://docs.netlify.com)
- [Stripe Docs](https://stripe.com/docs)
- [Supabase Docs](https://supabase.com/docs)

## Cost Estimation

### Monthly Costs (Estimated)
- **Netlify**: $0-20/month (free tier is sufficient to start)
- **Supabase**: $0-25/month (free tier includes 500MB database)
- **Stripe**: 2.9% + 30¢ per transaction
- **Domain**: $10-15/year

### Scaling Considerations
- **Supabase**: Upgrade to Pro plan for more storage/bandwidth
- **Netlify**: Upgrade for more build minutes/bandwidth
- **CDN**: Consider Cloudflare for global performance

## Next Steps

### Immediate (Week 1)
1. Set up monitoring and alerts
2. Create backup strategy
3. Test all user flows

### Short Term (Month 1)
1. Implement email notifications
2. Add customer reviews
3. Set up abandoned cart recovery

### Long Term (Month 3+)
1. Add mobile app
2. Implement loyalty program
3. Add advanced analytics

---

**🎉 Congratulations! Your e-commerce platform is now production-ready!**

For support, check the troubleshooting section or contact the development team. 