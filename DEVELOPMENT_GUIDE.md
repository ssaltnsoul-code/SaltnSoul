# SaltnSoul Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Netlify CLI installed (`npm install -g netlify-cli`)
- Stripe account with API keys
- Supabase project set up

### Local Development Setup

1. **Clone and Install Dependencies**
```bash
git clone <your-repo>
cd SaltnSoul
npm install
```

2. **Environment Configuration**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your keys:
# - Add your Stripe keys (test mode recommended)
# - Add your Supabase credentials
# - Set URL=http://localhost:8080
```

3. **Start Development Server**
```bash
# Start Netlify development server (includes functions)
netlify dev

# Alternative: Regular Vite dev server (without functions)
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:8080
- Netlify Functions: http://localhost:8888/.netlify/functions/

## 🧪 Testing

### Automated Testing
```bash
# Run the test script (requires Netlify dev server running)
node test-checkout.js
```

### Manual Testing Steps

1. **Add Items to Cart**
   - Browse products on the homepage
   - Click "Add to Cart" on any product
   - Select size and color options

2. **Checkout Process**
   - Click cart icon → "Checkout"
   - Fill in customer information (all required fields)
   - Proceed to payment section

3. **Test Payment with Test Cards**
   - Use Stripe test cards (see table below)
   - Fill in card details in embedded checkout
   - Complete payment

4. **Order Confirmation**
   - Verify redirect to order confirmation page
   - Check that order details display correctly
   - Verify cart is cleared

### Stripe Test Cards

| Card Number | Outcome | CVC | Expiry |
|-------------|---------|-----|--------|
| `4242424242424242` | Success | Any 3 digits | Any future date |
| `4000000000000002` | Declined | Any 3 digits | Any future date |
| `4000000000009995` | Insufficient funds | Any 3 digits | Any future date |

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   ├── EmbeddedCheckout.tsx     # Stripe embedded checkout
│   ├── CartDrawer.tsx           # Shopping cart sidebar
│   ├── ProductGrid.tsx          # Product display grid
│   └── ...
├── pages/
│   ├── Checkout.tsx             # Checkout page
│   ├── OrderConfirmation.tsx    # Order success page
│   └── ...
└── contexts/
    └── CartContext.tsx          # Global cart state
```

### Backend Functions (Netlify)
```
netlify/functions/
├── create-checkout-session.js   # Creates Stripe checkout session
├── checkout-session-status.js   # Retrieves order details
├── stripe-webhook.js            # Handles Stripe webhooks
├── save-order.js               # Saves orders to Supabase
└── send-order-email.js         # Sends order confirmations
```

### Data Flow
1. **Cart → Checkout**: Customer adds items and proceeds to checkout
2. **Customer Info**: Form collects shipping/billing information
3. **Session Creation**: Frontend calls `create-checkout-session` function
4. **Payment**: Stripe Embedded Checkout handles payment securely
5. **Confirmation**: Customer redirected to order confirmation page
6. **Order Retrieval**: `checkout-session-status` fetches order details
7. **Notifications**: Email sent via `send-order-email` function

## 🔧 Configuration

### Environment Variables

**Required for Frontend:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_APP_URL=http://localhost:8080
```

**Required for Netlify Functions:**
```env
STRIPE_SECRET_KEY=sk_test_...
URL=http://localhost:8080
# Optional for webhooks:
STRIPE_WEBHOOK_SECRET=whsec_...
# Optional for Supabase integration:
SUPABASE_SERVICE_KEY=...
```

### Netlify Configuration (`netlify.toml`)
- Functions directory: `netlify/functions`
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects: API calls → Netlify Functions

## 🚨 Troubleshooting

### Common Issues

**1. "Stripe key not found"**
- Solution: Check `.env` file has correct `VITE_STRIPE_PUBLISHABLE_KEY`
- Verify key starts with `pk_test_` or `pk_live_`

**2. "Functions not found"**
- Solution: Use `netlify dev` instead of `npm run dev`
- Check `netlify.toml` configuration

**3. "CORS errors"**
- Solution: Functions include CORS headers
- Check browser developer tools for specific error

**4. "Payment form not loading"**
- Check Stripe publishable key is valid
- Verify customer info form is complete
- Check browser console for errors

**5. "Order confirmation not working"**
- Verify `session_id` parameter in URL
- Check `checkout-session-status` function logs
- Ensure order data is being saved

### Debug Tools

**Browser Developer Tools:**
- Network tab: Check API requests/responses
- Console: Look for JavaScript errors
- Application tab: Check localStorage for cart data

**Netlify Function Logs:**
```bash
# View function logs in real-time
netlify dev --live

# Or check logs in Netlify dashboard
```

**Stripe Dashboard:**
- Payments tab: See test transactions
- Events tab: Monitor webhooks
- Logs tab: Debug API calls

## 📦 Deployment

### Production Checklist

1. **Environment Variables**
   - Switch to live Stripe keys (`pk_live_`, `sk_live_`)
   - Set production URL in `URL` variable
   - Configure webhook secret if using webhooks

2. **Build and Deploy**
```bash
# Test production build locally
npm run build
netlify build

# Deploy to Netlify
netlify deploy --prod
```

3. **Post-Deployment Testing**
   - Test with real payment methods (small amounts)
   - Verify webhook endpoints if configured
   - Check email notifications work
   - Test mobile responsiveness

### Monitoring
- Set up Stripe webhook monitoring
- Monitor Netlify function logs
- Set up error tracking (optional: Sentry, etc.)

## 🎯 Performance Optimization

### Frontend
- Lazy load images
- Minimize bundle size
- Use React.memo for expensive components
- Optimize Stripe elements loading

### Backend
- Cache frequently accessed data
- Optimize database queries
- Use connection pooling for Supabase
- Monitor function cold starts

## 🔒 Security Best Practices

- Never expose secret keys in frontend code
- Use environment variables for all sensitive data
- Implement proper input validation
- Use HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

---

## 🆘 Getting Help

**Common Resources:**
- [Stripe Documentation](https://stripe.com/docs)
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Supabase Documentation](https://supabase.com/docs)

**Debugging Steps:**
1. Check browser console for errors
2. Review Netlify function logs
3. Test with Stripe's test cards
4. Verify environment variables are set
5. Check network requests in developer tools

Happy coding! 🎉