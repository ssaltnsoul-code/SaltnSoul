# Stripe Embedded Checkout Setup Guide

## 🚀 Overview

The SaltnSoul e-commerce platform now uses Stripe's Embedded Checkout for secure, streamlined payment processing. This guide will help you set up and test the integration.

## 📋 Prerequisites

1. A Stripe account (https://stripe.com)
2. Netlify account for deployment
3. Node.js and npm installed

## 🔧 Setup Steps

### 1. Get Your Stripe Keys

1. Log in to your Stripe Dashboard
2. Navigate to **Developers > API Keys**
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

### 2. Environment Variables

Create a `.env` file in your project root:

```env
# Stripe Configuration (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Configuration (Backend - for Netlify Functions)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Other required variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
URL=http://localhost:8080
```

### 3. Netlify Deployment

For **local testing** with Netlify Functions:

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Start local development server
netlify dev
```

For **production deployment**:

1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `URL`: Your site's URL (e.g., https://your-site.netlify.app)

## 🧪 Testing

### Stripe Test Cards

Use these test card numbers for different scenarios:

| Card Number | Brand | Outcome |
|-------------|-------|---------|
| `4242424242424242` | Visa | Success |
| `4000000000000002` | Visa | Declined |
| `4000000000009995` | Visa | Insufficient funds |
| `4000000000009987` | Visa | Lost card |
| `4000000000000069` | Visa | Expired card |

**Test Details:**
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **Zip Code**: Any 5 digits (e.g., 12345)

### Testing Flow

1. **Add Items to Cart**: Browse products and add them to your cart
2. **Go to Checkout**: Click checkout and fill in customer information
3. **Payment**: The Stripe Embedded Checkout form will appear
4. **Use Test Card**: Enter a test card number from the table above
5. **Complete Payment**: Submit the form
6. **Order Confirmation**: You'll be redirected to the order confirmation page

### What Happens During Payment

1. **Frontend**: Collects customer info and cart items
2. **Netlify Function**: Creates Stripe checkout session with line items
3. **Stripe Embedded Checkout**: Handles secure payment form
4. **Payment Processing**: Stripe processes the payment
5. **Redirect**: Customer is sent to order confirmation page
6. **Order Data**: Retrieved from Stripe session and displayed

## 🔍 Troubleshooting

### Common Issues

**1. "Payment form not loading"**
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
- Verify the key starts with `pk_test_` or `pk_live_`
- Check browser console for errors

**2. "Failed to create checkout session"**
- Ensure `STRIPE_SECRET_KEY` is set in Netlify environment
- Check that Netlify Functions are deployed
- Verify your Stripe account is active

**3. "Order confirmation not loading"**
- Check that the `URL` environment variable matches your site URL
- Ensure the session_id parameter is present in the URL
- Check Netlify Function logs for errors

### Debugging Steps

1. **Check Environment Variables**:
   ```bash
   # Local development
   echo $VITE_STRIPE_PUBLISHABLE_KEY
   
   # In Netlify dashboard, verify all vars are set
   ```

2. **Test Netlify Functions Locally**:
   ```bash
   # Start Netlify dev server
   netlify dev
   
   # Test function directly
   curl -X POST http://localhost:8888/.netlify/functions/create-checkout-session \
     -H "Content-Type: application/json" \
     -d '{"items": [], "customerInfo": {}, "total": 10}'
   ```

3. **Check Stripe Dashboard**:
   - Go to Stripe Dashboard > Payments
   - Verify test payments are appearing
   - Check for any webhook errors

## 🎯 Key Features

- **Secure Payment Processing**: All payment data handled by Stripe
- **Multiple Payment Methods**: Cards, digital wallets (when configured)
- **Real-time Validation**: Instant feedback on card errors
- **Mobile Optimized**: Works seamlessly on all devices
- **Inventory Management**: Automatic stock updates after payment
- **Order Tracking**: Real order data from Stripe sessions

## 🔒 Security Notes

- Never commit your secret keys to version control
- Use test keys in development, live keys in production
- Stripe handles all PCI compliance requirements
- All payment data is encrypted and secure

## 📞 Support

- **Stripe Documentation**: https://stripe.com/docs
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Issues**: Report bugs in the GitHub repository

---

🎉 **You're all set!** Your e-commerce platform now has production-ready payment processing with Stripe Embedded Checkout.