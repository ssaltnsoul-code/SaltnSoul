# Salt & Soul - Premium Activewear Store

A modern e-commerce platform for premium activewear, built with React, TypeScript, Shopify, and Stripe.

## Features

- **Product Catalog** - Browse premium activewear collections via Shopify
- **Shopping Cart** - Add items with size/color selection
- **Secure Checkout** - Stripe payment processing
- **Admin Dashboard** - Manage products and orders through Shopify Admin API
- **Real-time Inventory** - Live stock tracking via Shopify
- **Mobile Responsive** - Optimized for all devices

## Tech Stack

- React 18 + TypeScript
- Shopify (Products + Orders + Inventory)
- Stripe (Payments)
- Tailwind CSS + shadcn/ui
- Vite + Netlify

## Setup

### 1. Shopify Configuration

1. Create a Shopify store or use an existing one
2. Generate API credentials:
   - Go to your Shopify Admin → Apps → Develop apps
   - Create a private app with the following permissions:
     - Products: Read and write
     - Orders: Read and write
     - Customers: Read and write
     - Inventory: Read and write
3. Also create a Storefront API access token for frontend operations

### 2. Environment Variables

Update your `.env` file with your Shopify credentials:

```env
# Shopify Configuration
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_KEY=ee1e72e9e11800c5517f2a086053a24c
SHOPIFY_API_SECRET=b716682fec4f635ac37ce072214de29b
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App Configuration
VITE_APP_NAME=SaltnSoul
VITE_APP_URL=http://localhost:5173
```

### 3. Install and Run

```bash
npm install
npm run dev
```

## Admin Access

Visit `/admin` with credentials:
- Email: `admin@saltnsoul.com`
- Password: `admin123`

## Shopify Integration

- Products are fetched from your Shopify store
- Orders are created in Shopify when customers complete checkout
- Inventory levels are managed through Shopify
- Admin panel connects to Shopify Admin API for management

## Development Notes

- The app falls back to mock data if Shopify API is unavailable
- Webhook endpoint available at `/api/shopify-webhook` for real-time updates
- All payments are processed through Stripe before orders are created in Shopify