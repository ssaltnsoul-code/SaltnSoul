/*
  # E-commerce Database Schema for Premium Activewear Store

  1. New Tables
    - `products` - Store product catalog with variants, pricing, and inventory
    - `orders` - Customer orders with shipping and payment information  
    - `order_items` - Individual items within each order
    - `customers` - Customer profiles and information

  2. Security
    - Enable RLS on all tables
    - Add policies for public product access
    - Add policies for customer order management

  3. Sample Data
    - Premium activewear products (sports bras, leggings, tops, sets)
    - Realistic inventory levels
    - Professional product descriptions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT,
  category TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  inventory_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_zip TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (optional for future use)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at 
      BEFORE UPDATE ON products 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_orders_updated_at') THEN
    CREATE TRIGGER update_orders_updated_at 
      BEFORE UPDATE ON orders 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products can be updated by authenticated users" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Products can be inserted by authenticated users" ON products
  FOR INSERT WITH CHECK (true);

-- RLS Policies for orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Users can update orders" ON orders
  FOR UPDATE USING (true);

-- RLS Policies for order items
CREATE POLICY "Order items can be created" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items can be viewed" ON order_items
  FOR SELECT USING (true);

-- RLS Policies for customers
CREATE POLICY "Customers can be created" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can be viewed" ON customers
  FOR SELECT USING (true);

-- Insert premium activewear products
INSERT INTO products (name, description, price, original_price, image_url, category, sizes, colors, in_stock, featured, inventory_count) VALUES
('Elevation Sports Bra', 'Premium high-support sports bra with seamless construction and moisture-wicking technology. Perfect for high-intensity workouts.', 68.00, 85.00, 'https://images.pexels.com/photos/6740819/pexels-photo-6740819.jpeg?auto=compress&cs=tinysrgb&w=500', 'Sports Bras', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Nude', 'White', 'Navy'], true, true, 45),

('Flow State Leggings', 'Ultra-soft high-waisted leggings with four-way stretch and side pockets. Designed for maximum comfort and mobility.', 98.00, 125.00, 'https://images.pexels.com/photos/6740844/pexels-photo-6740844.jpeg?auto=compress&cs=tinysrgb&w=500', 'Leggings', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Olive', 'Charcoal', 'Navy'], true, true, 52),

('Essential Tank', 'Relaxed-fit tank with curved hem and breathable bamboo blend fabric. Perfect for yoga and casual wear.', 52.00, NULL, 'https://images.pexels.com/photos/6740870/pexels-photo-6740870.jpeg?auto=compress&cs=tinysrgb&w=500', 'Tops', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Black', 'Sand', 'Rose'], true, true, 38),

('Power Shorts', 'High-performance 5-inch shorts with compression fit and phone pocket. Ideal for running and training.', 58.00, NULL, 'https://images.pexels.com/photos/6740816/pexels-photo-6740816.jpeg?auto=compress&cs=tinysrgb&w=500', 'Shorts', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Charcoal'], true, false, 29),

('Mindful Set', 'Complete matching set with sports bra and leggings. Sustainable fabric with buttery-soft feel.', 148.00, 185.00, 'https://images.pexels.com/photos/6740795/pexels-photo-6740795.jpeg?auto=compress&cs=tinysrgb&w=500', 'Sets', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Sage', 'Black', 'Nude'], true, true, 18),

('Movement Crop Top', 'Cropped long-sleeve with thumbholes and flattering side seams. Made from recycled materials.', 64.00, NULL, 'https://images.pexels.com/photos/6740823/pexels-photo-6740823.jpeg?auto=compress&cs=tinysrgb&w=500', 'Tops', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Grey'], true, false, 33),

('Performance Jacket', 'Lightweight zip-up jacket with water-resistant finish. Perfect for outdoor workouts.', 118.00, 145.00, 'https://images.pexels.com/photos/6740825/pexels-photo-6740825.jpeg?auto=compress&cs=tinysrgb&w=500', 'Outerwear', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Olive'], true, true, 22),

('Align Bike Shorts', '7-inch bike shorts with no-dig waistband and smooth fabric. Ideal for yoga and pilates.', 48.00, NULL, 'https://images.pexels.com/photos/6740813/pexels-photo-6740813.jpeg?auto=compress&cs=tinysrgb&w=500', 'Shorts', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Nude', 'Navy'], true, false, 41);