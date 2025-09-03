<<<<<<< HEAD
import { Product, CartItem, ProductVariant } from '@/types/product';
import { shopifyClient, makeAdminAPIRequest } from './shopify';

// Cart management
let cart: any = null;

// Initialize Shopify cart
export const initializeCart = async () => {
  if (!cart) {
    cart = await shopifyClient.checkout.create();
  }
  return cart;
};

// Product cache
let products: Product[] = [];

// Helper function to transform Shopify product to our Product type
const transformShopifyProduct = (shopifyProduct: any): Product => {
  const firstVariant = shopifyProduct.variants?.[0];
  
  return {
    id: shopifyProduct.id,
    shopifyId: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price: firstVariant ? parseFloat(firstVariant.price) : 0,
    originalPrice: firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice) : undefined,
    image: shopifyProduct.images?.[0]?.src || '',
    category: shopifyProduct.productType || 'Uncategorized',
    sizes: shopifyProduct.options?.find((opt: any) => opt.name.toLowerCase().includes('size'))?.values || [],
    colors: shopifyProduct.options?.find((opt: any) => opt.name.toLowerCase().includes('color'))?.values || [],
    inStock: shopifyProduct.variants?.some((v: any) => v.availableForSale) || false,
    featured: shopifyProduct.tags?.includes('featured') || false,
    stockQuantity: shopifyProduct.variants?.reduce((total: number, variant: any) => 
      total + (variant.inventory?.quantity || 0), 0) || 0,
    variants: shopifyProduct.variants?.map((variant: any) => ({
      id: variant.id,
      title: variant.title,
      price: parseFloat(variant.price),
      compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : undefined,
      availableForSale: variant.availableForSale,
      selectedOptions: variant.selectedOptions || [],
    })) || [],
  };
};

// Fetch all products from Shopify
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const shopifyProducts = await shopifyClient.product.fetchAll();
    
    const transformedProducts = shopifyProducts.map(transformShopifyProduct);
    products = transformedProducts;
    
    return transformedProducts;
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return products;
  }
};

// Create product via Shopify Admin API
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const shopifyProductData = {
      product: {
        title: productData.name,
        body_html: productData.description,
        vendor: 'SaltnSoul',
        product_type: productData.category,
        tags: productData.featured ? 'featured' : '',
        images: productData.image ? [{ src: productData.image }] : [],
        variants: [{
          price: productData.price.toString(),
          compare_at_price: productData.originalPrice?.toString(),
          inventory_management: 'shopify',
          inventory_quantity: productData.stockQuantity || 0,
        }],
        options: [
          ...(productData.sizes.length > 0 ? [{ name: 'Size', values: productData.sizes }] : []),
          ...(productData.colors.length > 0 ? [{ name: 'Color', values: productData.colors }] : []),
        ],
      },
    };

    const response = await makeAdminAPIRequest('products.json', {
      method: 'POST',
      body: JSON.stringify(shopifyProductData),
    });

    const newProduct = transformShopifyProduct(response.product);
    products.push(newProduct);
    return newProduct;
=======
import { Product } from '@/types/product';
import { CartItem } from '@/types/product';
import { shopifyStorefrontFetch, CHECKOUT_CREATE_MUTATION } from './shopify';

// Shopify Admin API calls (server-side via Netlify functions)
const callShopifyAdmin = async (action: string, params: any = {}) => {
  try {
    const response = await fetch('/api/shopify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Shopify Admin API error (${action}):`, error);
    throw error;
  }
};

// Get all products from Shopify
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await callShopifyAdmin('getProducts');
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    // Return empty array as fallback
    return [];
  }
};

// Create new product in Shopify
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    return await callShopifyAdmin('createProduct', { product: productData });
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
  } catch (error) {
    console.error('Error creating product in Shopify:', error);
    throw error;
  }
};

<<<<<<< HEAD
// Update product via Shopify Admin API
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const shopifyId = id.startsWith('gid://') ? id.split('/').pop() : id;
    
    const updateData = {
      product: {
        id: shopifyId,
        ...(updates.name && { title: updates.name }),
        ...(updates.description && { body_html: updates.description }),
        ...(updates.category && { product_type: updates.category }),
        ...(updates.featured !== undefined && { tags: updates.featured ? 'featured' : '' }),
      },
    };

    const response = await makeAdminAPIRequest(`products/${shopifyId}.json`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    const updatedProduct = transformShopifyProduct(response.product);
    
    // Update local cache
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = updatedProduct;
    }

    return updatedProduct;
=======
// Update product in Shopify
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    return await callShopifyAdmin('updateProduct', { id, product: productData });
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
  } catch (error) {
    console.error('Error updating product in Shopify:', error);
    throw error;
  }
};

<<<<<<< HEAD
// Delete product via Shopify Admin API
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const shopifyId = id.startsWith('gid://') ? id.split('/').pop() : id;
    
    await makeAdminAPIRequest(`products/${shopifyId}.json`, {
      method: 'DELETE',
    });

    // Remove from local cache
    products = products.filter(p => p.id !== id);
  } catch (error) {
    console.error('Error deleting product in Shopify:', error);
=======
// Delete product from Shopify
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await callShopifyAdmin('deleteProduct', { id });
  } catch (error) {
    console.error('Error deleting product from Shopify:', error);
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
    throw error;
  }
};

<<<<<<< HEAD
// Get single product by handle or ID
export const getProduct = async (handleOrId: string): Promise<Product | null> => {
  try {
    const shopifyProduct = await shopifyClient.product.fetchByHandle(handleOrId);
    return transformShopifyProduct(shopifyProduct);
  } catch (error) {
    try {
      const shopifyProduct = await shopifyClient.product.fetch(handleOrId);
      return transformShopifyProduct(shopifyProduct);
    } catch (secondError) {
      console.error('Error fetching product from Shopify:', error, secondError);
      return null;
    }
  }
};

// Cart operations using Shopify Storefront API
export const addToCart = async (variantId: string, quantity: number = 1) => {
  try {
    if (!cart) {
      cart = await initializeCart();
    }
    
    const lineItems = [{
      variantId,
      quantity,
    }];
    
    cart = await shopifyClient.checkout.addLineItems(cart.id, lineItems);
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (lineItemId: string) => {
  try {
    if (!cart) return null;
    
    cart = await shopifyClient.checkout.removeLineItems(cart.id, [lineItemId]);
    return cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItem = async (lineItemId: string, quantity: number) => {
  try {
    if (!cart) return null;
    
    const lineItems = [{
      id: lineItemId,
      quantity,
    }];
    
    cart = await shopifyClient.checkout.updateLineItems(cart.id, lineItems);
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const getCart = async () => {
  if (!cart) {
    cart = await initializeCart();
  }
  return cart;
};

export const clearCart = async () => {
  cart = await shopifyClient.checkout.create();
  return cart;
};

// Get order status via Shopify Admin API
export const getOrderStatus = async (orderId: string) => {
  try {
    const response = await makeAdminAPIRequest(`orders/${orderId}.json`);
    const order = response.order;
    
    return {
      id: order.id,
      status: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
      total: parseFloat(order.total_price),
      createdAt: order.created_at,
      customerEmail: order.email,
    };
  } catch (error) {
    console.error('Error fetching order status from Shopify:', error);
    return null;
  }
};

// Get all orders via Shopify Admin API
export const getAllOrders = async () => {
  try {
    const response = await makeAdminAPIRequest('orders.json?status=any&limit=250');
    const orders = response.orders;
    
    return orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerInfo: {
        name: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Guest',
        email: order.email,
        address: order.shipping_address ? 
          `${order.shipping_address.address1}, ${order.shipping_address.city}, ${order.shipping_address.province} ${order.shipping_address.zip}` : '',
      },
      total: parseFloat(order.total_price),
      status: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
      createdAt: order.created_at,
      items: order.line_items?.map((item: any) => ({
        product: {
          id: item.product_id,
          name: item.title,
          price: parseFloat(item.price),
          image: '', // Would need separate API call to get product images
        },
        quantity: item.quantity,
        variant: item.variant_title,
      })) || [],
    }));
  } catch (error) {
    console.error('Error fetching orders from Shopify:', error);
    return [];
  }
};

// Get inventory levels via Shopify Admin API
export const getInventoryLevels = async () => {
  try {
    const response = await makeAdminAPIRequest('products.json?limit=250&fields=id,variants');
    const products = response.products;
    
    const inventory: Record<string, number> = {};
    
    products.forEach((product: any) => {
      product.variants.forEach((variant: any) => {
        inventory[variant.id] = variant.inventory_quantity || 0;
      });
    });
    
    return inventory;
  } catch (error) {
    console.error('Error fetching inventory from Shopify:', error);
    return {};
  }
};

// Update inventory via Shopify Admin API
export const updateInventory = async (variantId: string, quantity: number) => {
  try {
    // First get the inventory item ID
    const variantResponse = await makeAdminAPIRequest(`variants/${variantId}.json`);
    const inventoryItemId = variantResponse.variant.inventory_item_id;
    
    // Get location ID (assuming first location)
    const locationsResponse = await makeAdminAPIRequest('locations.json');
    const locationId = locationsResponse.locations[0]?.id;
    
    if (!locationId) {
      throw new Error('No locations found');
    }
    
    // Update inventory level
    await makeAdminAPIRequest(`inventory_levels/set.json`, {
      method: 'POST',
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });
    
    // Update local cache
    const product = products.find(p => p.variants?.some(v => v.id === variantId));
    if (product) {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant) {
        variant.availableForSale = quantity > 0;
      }
      product.stockQuantity = product.variants?.reduce((total, v) => 
        total + (v.id === variantId ? quantity : 0), 0) || 0;
      product.inStock = quantity > 0;
=======
// Get all orders from Shopify
export const getAllOrders = async () => {
  try {
    return await callShopifyAdmin('getOrders');
  } catch (error) {
    console.error('Error fetching orders from Shopify:', error);
    return [];
  }
};

// Get all customers from Shopify
export const getAllCustomers = async () => {
  try {
    return await callShopifyAdmin('getCustomers');
  } catch (error) {
    console.error('Error fetching customers from Shopify:', error);
    return [];
  }
};

// Get inventory levels from Shopify
export const getInventoryLevels = async (): Promise<Record<string, number>> => {
  try {
    const products = await getAllProducts();
    const inventory: Record<string, number> = {};
    
    products.forEach(product => {
      inventory[product.id] = product.inventory_count || 0;
    });

    return inventory;
  } catch (error) {
    console.error('Error fetching inventory from Shopify:', error);
    return {};
  }
};

// Update inventory in Shopify
export const updateInventory = async (productId: string, quantity: number): Promise<void> => {
  try {
    // For simplicity, we'll use the first variant of the product
    // In a real implementation, you'd need to handle multiple variants
    await callShopifyAdmin('updateInventory', { variantId: productId, quantity });
  } catch (error) {
    console.error('Error updating inventory in Shopify:', error);
    throw error;
  }
};

// Create Shopify checkout for embedded checkout
export const createShopifyCheckout = async (checkoutData: {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}) => {
  try {
    // Transform cart items to Shopify line items
    const lineItems = checkoutData.items.map(item => ({
      variantId: `gid://shopify/ProductVariant/${item.product.id}`,
      quantity: item.quantity,
    }));

    const checkoutInput = {
      lineItems,
      email: checkoutData.customerInfo.email,
      shippingAddress: {
        firstName: checkoutData.customerInfo.name.split(' ')[0],
        lastName: checkoutData.customerInfo.name.split(' ').slice(1).join(' '),
        address1: checkoutData.customerInfo.address,
        city: checkoutData.customerInfo.city,
        province: checkoutData.customerInfo.state,
        zip: checkoutData.customerInfo.zipCode,
        country: 'US',
      },
    };

    const data = await shopifyStorefrontFetch(CHECKOUT_CREATE_MUTATION, {
      input: checkoutInput,
    });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
    }

    return {
      checkout: data.checkoutCreate.checkout,
      checkoutId: data.checkoutCreate.checkout.id.split('/').pop(),
      checkoutUrl: data.checkoutCreate.checkout.webUrl,
    };
  } catch (error) {
<<<<<<< HEAD
    console.error('Error updating inventory in Shopify:', error);
=======
    console.error('Error creating Shopify checkout:', error);
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
    throw error;
  }
};

<<<<<<< HEAD
// Admin authentication (simplified for Shopify)
export const authenticateAdmin = async (email: string, password: string) => {
  // Simple admin authentication - in production, integrate with proper auth system
  if (email === 'admin@saltnsoul.com' && password === 'admin123') {
    const token = `shopify_admin_token_${Date.now()}`;
    localStorage.setItem('adminToken', token);
    return { success: true, token };
  }
  throw new Error('Invalid credentials');
};

export const verifyAdminToken = async () => {
  const token = localStorage.getItem('adminToken');
  return token && token.startsWith('shopify_admin_token_');
};

// Initialize products cache
export const initializeProducts = (defaultProducts?: Product[]) => {
  if (defaultProducts) {
    products = defaultProducts;
  }
}; 
=======
// Initialize products - no longer needed since we're using Shopify as source of truth
export const initializeProducts = async (products: any[]) => {
  // This function is now deprecated since we're using Shopify as the source of truth
  console.log('Products are now managed in Shopify. Please add products through your Shopify admin or the admin panel.');
};

// Process order - this will be handled by Shopify's checkout
export const processOrder = async (orderData: any) => {
  // Orders are now processed through Shopify's checkout
  // This function is kept for compatibility but orders are created automatically by Shopify
  console.log('Orders are now processed through Shopify checkout');
  return orderData;
};

// Create payment intent - no longer needed with Shopify checkout
export const createPaymentIntent = async (amount: number) => {
  // Payment intents are now handled by Shopify
  console.log('Payment processing is now handled by Shopify');
  return {
    clientSecret: 'shopify_handled',
    id: `shopify_${Date.now()}`,
  };
};
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
