# SaltnSoul - E-commerce Platform

A modern, production-ready e-commerce platform built with React, TypeScript, and integrated with Supabase and Stripe.

## 🚀 Features

- **Real-time Product Management** - Full CRUD operations with Supabase
- **Secure Payment Processing** - Stripe integration with live payment processing
- **Admin Dashboard** - Complete inventory and order management
- **Mobile-Responsive Design** - Optimized for all devices
- **Search & Filtering** - Advanced product discovery
- **Cart Persistence** - Global cart state management
- **Order Tracking** - Complete order lifecycle management

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Payments**: Stripe Payment Intents
- **Hosting**: Netlify (with serverless functions)
- **State Management**: React Context API

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ssaltnsoul-code/SaltnSoul.git

# Navigate to project directory
cd SaltnSoul

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe credentials

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_NAME=SaltnSoul
VITE_APP_URL=http://localhost:8080
```

## 🗄 Database Setup

1. Create a Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Update environment variables with your Supabase credentials

## 💳 Payment Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Update environment variables with your Stripe credentials

## 🚀 Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with build command: `npm run build`
4. Set publish directory: `dist`

### Environment Variables for Production

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
```

## 📱 Usage

### Customer Features
- Browse products with search and filtering
- Add items to cart with size/color selection
- Secure checkout with Stripe payments
- Order confirmation and tracking

### Admin Features
- Product management (CRUD operations)
- Inventory tracking and updates
- Order management and status tracking
- Sales analytics and reporting

**Admin Login**: `admin@saltnsoul.com` / `admin123`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # API and utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 📄 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Production Status](PRODUCTION_STATUS.md)
- [Integration Status](INTEGRATION_STATUS.md)
- [Admin Guide](ADMIN_GUIDE.md)

## 💰 Costs

- **Netlify**: $0/month (free tier)
- **Supabase**: $0/month (free tier)
- **Stripe**: 2.9% + 30¢ per transaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for modern e-commerce**
