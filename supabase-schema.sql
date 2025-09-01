-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT,
  category TEXT,
  sizes TEXT[],
  colors TEXT[],
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
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
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image, category, sizes, colors, in_stock, featured, stock_quantity) VALUES
('Premium Yoga Leggings', 'High-performance yoga leggings with moisture-wicking technology', 89.99, 119.99, '/src/assets/product-leggings.jpg', 'Bottoms', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Charcoal'], true, true, 50),
('Athletic Shorts', 'Comfortable athletic shorts perfect for workouts', 49.99, 69.99, '/src/assets/product-shorts.jpg', 'Bottoms', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Gray', 'Blue'], true, false, 30),
('Sports Bra', 'Supportive sports bra for high-impact activities', 39.99, 59.99, '/src/assets/product-sports-bra.jpg', 'Tops', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'White', 'Pink'], true, true, 45),
('Tank Top', 'Lightweight tank top for yoga and pilates', 29.99, 39.99, '/src/assets/product-tank-top.jpg', 'Tops', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Black', 'Gray'], true, false, 25),
('Premium Hoodie', 'Cozy hoodie perfect for post-workout recovery', 79.99, 99.99, '/src/assets/placeholder.svg', 'Outerwear', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Gray', 'Navy'], true, true, 20),
('Workout Gloves', 'Grip-enhancing workout gloves', 19.99, 24.99, '/src/assets/placeholder.svg', 'Accessories', ARRAY['S', 'M', 'L'], ARRAY['Black', 'Gray'], true, false, 35);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Create policies for authenticated users to create orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true);

-- Create policies for order items
CREATE POLICY "Order items are viewable by order owner" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Order items can be created with order" ON order_items
  FOR INSERT WITH CHECK (true); 