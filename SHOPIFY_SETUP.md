# Shopify Integration Setup Guide

## 🚀 Overview

Your e-commerce platform now integrates directly with Shopify to:
- **Load products** from your Shopify store
- **Manage collections** and product placement through the admin interface
- **Organize** which products appear in different sections of your website
- **Sync inventory** and product data in real-time

## 📋 Prerequisites

1. **Shopify Store**: You need an active Shopify store
2. **API Access**: Admin API access to your Shopify store
3. **Storefront API**: For customer-facing product loading

## 🔧 Shopify Configuration

### Step 1: Create a Private App in Shopify

1. Go to your Shopify Admin dashboard
2. Navigate to **Settings > Apps and sales channels**
3. Click **Develop apps for your store**
4. Click **Create an app**
5. Name your app (e.g., "SaltnSoul Website")

### Step 2: Configure App Permissions

#### Admin API Permissions:
- **Products**: `read_products`, `write_products`
- **Collections**: `read_collections`, `write_collections`
- **Orders**: `read_orders`, `write_orders`
- **Inventory**: `read_inventory`, `write_inventory`

#### Storefront API Permissions:
- **Products**: ✅ Allow
- **Collections**: ✅ Allow
- **Product listings**: ✅ Allow

### Step 3: Get Your API Credentials

After creating the app, you'll get:
1. **Admin API Access Token** - for managing products/collections
2. **Storefront Access Token** - for customer-facing product loading
3. **Store URL** - your-store.myshopify.com

## 🌐 Environment Variables

Create a `.env` file in your project root:

```env
# Shopify Configuration
VITE_SHOPIFY_STORE_URL=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Other configurations...
NODE_VERSION=18
```

## 🎛️ Admin Collection Management

### Accessing the Admin Panel

1. Go to `/admin` on your website
2. Log in with admin credentials
3. Navigate to **Collections** in the sidebar

### Managing Website Sections

The admin interface allows you to:

#### 📍 **Available Sections:**
- **Hero Section** - Main featured products (max 4)
- **Featured Products** - Highlighted items (max 8)
- **New Arrivals** - Latest products (max 12)
- **Best Sellers** - Top performing products (max 8)
- **Women's Collection** - Women's activewear
- **Men's Collection** - Men's activewear

#### 🔧 **For Each Section You Can:**
1. **Select Products Manually** - Choose specific products
2. **Import from Shopify Collections** - Sync entire collections
3. **Configure Display Settings:**
   - Layout (Grid, Carousel, List)
   - Products per row (2, 3, 4, or 6)
   - Show/hide titles and descriptions
   - Set sorting preferences

#### 💾 **Product Selection Options:**
- **Manual Selection**: Pick individual products
- **Shopify Collections**: Import all products from a Shopify collection
- **Mixed Approach**: Import from Shopify, then customize

## 🔄 How It Works

### 1. **Product Loading**
- Products are loaded from Shopify via API
- Cached locally for performance
- Updated automatically when you make changes in admin

### 2. **Collection Mapping**
- Admin creates mappings between website sections and products
- Mappings are stored in browser localStorage
- Can be exported/imported for deployment

### 3. **Frontend Display**
- Website sections use these mappings to show products
- Fallback logic if no mapping exists
- Loading states and error handling

## 🎯 Usage Examples

### Example 1: Setting up Hero Section
1. Go to Admin > Collections
2. Click "Configure" on Hero Section
3. Select 4 of your best products
4. Choose "Grid" layout, 4 per row
5. Save configuration

### Example 2: Syncing Women's Collection
1. Go to Admin > Collections
2. Click "Configure" on Women's Collection
3. Go to "Shopify Collections" tab
4. Find your "Women's Activewear" collection
5. Click "Import Products"
6. Adjust display settings as needed
7. Save configuration

## 🚨 Troubleshooting

### Products Not Loading
1. Check your `.env` file has correct Shopify credentials
2. Verify API permissions in Shopify admin
3. Check browser console for API errors
4. Ensure Shopify store is published and active

### Collections Not Syncing
1. Verify Admin API token has collection permissions
2. Check that collections exist in Shopify
3. Ensure collections have products assigned

### Permission Errors
1. Regenerate API tokens in Shopify
2. Double-check all required permissions are enabled
3. Test API access with a simple curl request

## 📱 Production Deployment

When deploying to production:

1. **Environment Variables**: Set all Shopify credentials in your hosting platform
2. **HTTPS Required**: Shopify APIs require HTTPS in production
3. **Webhook Setup**: Consider setting up webhooks for real-time updates
4. **Backup**: Export your collection mappings before deployment

## 🔗 Useful Links

- [Shopify Admin API Documentation](https://shopify.dev/docs/admin-api)
- [Shopify Storefront API Documentation](https://shopify.dev/docs/storefront-api)
- [Creating Private Apps](https://shopify.dev/docs/apps/auth/admin-app-access-tokens)

## 📞 Support

If you encounter issues:
1. Check Shopify API status page
2. Verify your API rate limits
3. Review Shopify app logs in admin dashboard
4. Test API endpoints directly with tools like Postman

---

🎉 **You're all set!** Your website now has a powerful, admin-controlled product management system powered by Shopify.
