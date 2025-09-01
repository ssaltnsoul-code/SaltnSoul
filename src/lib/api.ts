import { Product, CartItem } from '@/types/product';
import { supabase, type Product as SupabaseProduct, type Order as SupabaseOrder } from './supabase';
import { createPaymentIntent, processMockPayment } from './stripe';

// Mock data storage (fallback for development)
const orders: Array<{
  id: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    size: string;
    color: string;
  }>;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}> = [];
const inventory: Record<string, number> = {};

// Product management with Supabase integration
let products: Product[] = [];

// Initialize inventory
export const initializeInventory = () => {
  const defaultInventory = [
    { id: '1', stock: 50 },
    { id: '2', stock: 30 },
    { id: '3', stock: 45 },
    { id: '4', stock: 25 },
    { id: '5', stock: 20 },
    { id: '6', stock: 35 },
  ];
  
  defaultInventory.forEach(product => {
    inventory[product.id] = product.stock;
  });
};

// Real Supabase product operations
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, falling back to mock data:', error);
      return products;
    }

    // Transform Supabase data to match our Product type
    const transformedProducts: Product[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.original_price,
      image: item.image_url, // Updated to match your schema
      category: item.category,
      sizes: item.sizes,
      colors: item.colors,
      inStock: item.in_stock,
      featured: item.featured,
      stockQuantity: item.inventory_count, // Updated to match your schema
    }));

    products = transformedProducts;
    return transformedProducts;
  } catch (error) {
    console.warn('Error fetching from Supabase, using mock data:', error);
    return products;
  }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        image_url: productData.image, // Updated to match your schema
        category: productData.category,
        sizes: productData.sizes,
        colors: productData.colors,
        in_stock: productData.inStock,
        featured: productData.featured,
        inventory_count: productData.stockQuantity, // Updated to match your schema
      }])
      .select()
      .single();

    if (error) throw error;

    const newProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      image: data.image_url, // Updated to match your schema
      category: data.category,
      sizes: data.sizes,
      colors: data.colors,
      inStock: data.in_stock,
      featured: data.featured,
      stockQuantity: data.inventory_count, // Updated to match your schema
    };

    products.push(newProduct);
    return newProduct;
  } catch (error) {
    console.warn('Error creating product in Supabase, using mock data:', error);
    // Fallback to mock creation
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      ...productData,
    };
    products.push(newProduct);
    return newProduct;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        original_price: updates.originalPrice,
        image_url: updates.image, // Updated to match your schema
        category: updates.category,
        sizes: updates.sizes,
        colors: updates.colors,
        in_stock: updates.inStock,
        featured: updates.featured,
        inventory_count: updates.stockQuantity, // Updated to match your schema
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      image: data.image_url, // Updated to match your schema
      category: data.category,
      sizes: data.sizes,
      colors: data.colors,
      inStock: data.in_stock,
      featured: data.featured,
      stockQuantity: data.inventory_count, // Updated to match your schema
    };

    // Update local products array
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = updatedProduct;
    }

    return updatedProduct;
  } catch (error) {
    console.warn('Error updating product in Supabase, using mock data:', error);
    // Fallback to mock update
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      return products[index];
    }
    throw new Error('Product not found');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Remove from local products array
    products = products.filter(p => p.id !== id);
  } catch (error) {
    console.warn('Error deleting product in Supabase, using mock data:', error);
    // Fallback to mock deletion
    products = products.filter(p => p.id !== id);
  }
};

export const initializeProducts = (defaultProducts: Product[]) => {
  products = defaultProducts;
};

// Real order processing with Supabase and Stripe integration
export const processOrder = async (orderData: {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}) => {
  try {
    // Calculate total
    const total = orderData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Create payment intent
    const paymentIntent = await createPaymentIntent(total);

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_email: orderData.customerInfo.email,
        customer_name: orderData.customerInfo.name,
        customer_address: orderData.customerInfo.address,
        customer_city: orderData.customerInfo.city,
        customer_state: orderData.customerInfo.state,
        customer_zip: orderData.customerInfo.zipCode,
        total,
        status: 'pending',
        payment_intent_id: paymentIntent.id,
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
      color: item.color,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update inventory
    for (const item of orderData.items) {
      await updateProduct(item.product.id, {
        stockQuantity: (item.product.stockQuantity || 0) - item.quantity,
        inStock: (item.product.stockQuantity || 0) - item.quantity > 0,
      });
    }

    return {
      id: order.id,
      items: orderData.items,
      customerInfo: orderData.customerInfo,
      total,
      status: 'processing',
      createdAt: order.created_at,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.warn('Error processing order with Supabase, using mock data:', error);
    
    // Fallback to mock processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check inventory
    for (const item of orderData.items) {
      const currentStock = inventory[item.product.id] || 0;
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}. Available: ${currentStock}`);
      }
    }

    // Reduce inventory
    for (const item of orderData.items) {
      inventory[item.product.id] = (inventory[item.product.id] || 0) - item.quantity;
    }

    // Create mock order
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: orderData.items,
      customerInfo: orderData.customerInfo,
      total: orderData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: 'processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    orders.push(order);
    return order;
  }
};

// Get order status
export const getOrderStatus = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      status: data.status,
      total: data.total,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.warn('Error fetching order status from Supabase:', error);
    
    // Fallback to mock data
    const order = orders.find(o => o.id === orderId);
    return order ? {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
    } : null;
  }
};

// Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((order: any) => ({
      id: order.id,
      customerInfo: {
        name: order.customer_name,
        email: order.customer_email,
        address: order.customer_address,
        city: order.customer_city,
        state: order.customer_state,
        zipCode: order.customer_zip,
      },
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      items: order.order_items?.map((item: any) => ({
        product: item.products,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })) || [],
    }));
  } catch (error) {
    console.warn('Error fetching orders from Supabase, using mock data:', error);
    return orders;
  }
};

// Inventory management
export const getInventoryLevels = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, inventory_count, in_stock'); // Updated to match your schema

    if (error) throw error;

    return data.reduce((acc: Record<string, number>, product: any) => {
      acc[product.id] = product.inventory_count || 0;
      return acc;
    }, {});
  } catch (error) {
    console.warn('Error fetching inventory from Supabase, using mock data:', error);
    return inventory;
  }
};

export const updateInventory = async (productId: string, quantity: number) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        inventory_count: quantity, // Updated to match your schema
        in_stock: quantity > 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (error) throw error;

    // Update local products array
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index].stockQuantity = quantity;
      products[index].inStock = quantity > 0;
    }
  } catch (error) {
    console.warn('Error updating inventory in Supabase, using mock data:', error);
    inventory[productId] = quantity;
  }
};

// Admin authentication (mock for now, can be extended with Supabase Auth)
export const authenticateAdmin = async (email: string, password: string) => {
  // Mock admin authentication
  if (email === 'admin@saltnsoul.com' && password === 'admin123') {
    const token = `admin_token_${Date.now()}`;
    localStorage.setItem('adminToken', token);
    return { success: true, token };
  }
  throw new Error('Invalid credentials');
};

export const verifyAdminToken = async () => {
  const token = localStorage.getItem('adminToken');
  return token && token.startsWith('admin_token_');
}; 