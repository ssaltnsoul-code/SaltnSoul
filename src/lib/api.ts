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

// Product and collection cache
let products: Product[] = [];
let collections: any[] = [];

// Collection interface
interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: string;
  products: Product[];
}

// Helper function to transform Shopify product to our Product type
const transformShopifyProduct = (shopifyProduct: any): Product | null => {
  if (!shopifyProduct) {
    console.error('Invalid shopify product data');
    return null;
  }
  
  const firstVariant = shopifyProduct.variants?.[0];
  
  // Handle price - Shopify SDK returns price as string or number
  let productPrice = 0;
  if (firstVariant?.price) {
    if (typeof firstVariant.price === 'string') {
      productPrice = parseFloat(firstVariant.price);
    } else if (typeof firstVariant.price === 'object' && firstVariant.price.amount) {
      productPrice = parseFloat(firstVariant.price.amount);
    } else {
      productPrice = parseFloat(firstVariant.price);
    }
  }
  
  // Ensure price is a valid number
  if (isNaN(productPrice) || productPrice < 0) {
    productPrice = 0;
  }
  
  // Handle availability
  const isInStock = shopifyProduct.variants?.some((v: any) => v.availableForSale) || false;
  
  // Handle images
  const imageUrl = shopifyProduct.images?.[0]?.src || shopifyProduct.images?.[0]?.url || '';
  
  // Handle original price
  let originalPrice = undefined;
  if (firstVariant?.compareAtPrice) {
    const parsedOriginalPrice = parseFloat(firstVariant.compareAtPrice);
    if (!isNaN(parsedOriginalPrice) && parsedOriginalPrice > 0) {
      originalPrice = parsedOriginalPrice;
    }
  }
  
  const transformed = {
    id: shopifyProduct.id || '',
    shopifyId: shopifyProduct.id || '',
    handle: shopifyProduct.handle || '',
    name: shopifyProduct.title || 'Untitled Product',
    description: shopifyProduct.description || '',
    price: productPrice,
    originalPrice,
    image: imageUrl,
    category: shopifyProduct.productType || 'Uncategorized',
    sizes: shopifyProduct.options?.find((opt: any) => opt.name.toLowerCase().includes('size'))?.values || [],
    colors: shopifyProduct.options?.find((opt: any) => opt.name.toLowerCase().includes('color'))?.values || [],
    inStock: isInStock,
    featured: shopifyProduct.tags?.includes('featured') || false,
    stockQuantity: shopifyProduct.variants?.reduce((total: number, variant: any) => 
      total + (variant.inventory?.quantity || 0), 0) || 0,
    variants: shopifyProduct.variants?.map((variant: any) => {
      let variantPrice = 0;
      if (variant.price) {
        if (typeof variant.price === 'object' && variant.price.amount) {
          variantPrice = parseFloat(variant.price.amount);
        } else {
          variantPrice = parseFloat(variant.price);
        }
      }
      if (isNaN(variantPrice)) variantPrice = 0;
      
      let variantComparePrice = undefined;
      if (variant.compareAtPrice) {
        const parsed = parseFloat(variant.compareAtPrice);
        if (!isNaN(parsed) && parsed > 0) {
          variantComparePrice = parsed;
        }
      }
      
      return {
        id: variant.id || '',
        title: variant.title || '',
        price: variantPrice,
        compareAtPrice: variantComparePrice,
        availableForSale: variant.availableForSale || false,
        selectedOptions: variant.selectedOptions || [],
      };
    }) || [],
  };
  
  return transformed;
};

// Fetch all products from Shopify with enhanced error handling
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from Shopify...');
    const shopifyProducts = await shopifyClient.product.fetchAll();
    console.log('Raw Shopify products:', shopifyProducts);
    
    if (!shopifyProducts || shopifyProducts.length === 0) {
      console.warn('No products returned from Shopify');
      return [];
    }
    
    const transformedProducts = shopifyProducts.map(transformShopifyProduct).filter((p): p is Product => p !== null);
    console.log('✅ Products loaded successfully:', transformedProducts.length, 'products');
    products = transformedProducts;
    
    return transformedProducts;
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    // Return empty array instead of cached products to make the issue obvious
    return [];
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

    const res = await fetch('/.netlify/functions/shopify-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopifyProductData),
    });
    const response = await res.json();

    const newProduct = transformShopifyProduct(response.product);
    products.push(newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error creating product in Shopify:', error);
    throw error;
  }
};

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

    const res = await fetch('/.netlify/functions/shopify-products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const response = await res.json();

    const updatedProduct = transformShopifyProduct(response.product);
    
    // Update local cache
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = updatedProduct;
    }

    return updatedProduct;
  } catch (error) {
    console.error('Error updating product in Shopify:', error);
    throw error;
  }
};

// Delete product via Shopify Admin API
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const shopifyId = id.startsWith('gid://') ? id.split('/').pop() : id;
    
    await fetch(`/.netlify/functions/shopify-products?id=${shopifyId}`, {
      method: 'DELETE',
    });

    // Remove from local cache
    products = products.filter(p => p.id !== id);
  } catch (error) {
    console.error('Error deleting product in Shopify:', error);
    throw error;
  }
};

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

// Get Shopify collections with products (via Netlify functions)
export const getShopifyCollections = async () => {
  try {
    console.log('Fetching collections from Netlify function...');

    const colRes = await fetch('/.netlify/functions/shopify-collections');
    const collectionsResponse = await colRes.json();
    const shopifyCollections = collectionsResponse.collections;

    if (!shopifyCollections || shopifyCollections.length === 0) {
      console.warn('No collections found in Shopify');
      return [];
    }

    const collections = await Promise.all(
      shopifyCollections.map(async (collection: any) => {
        try {
          const prodRes = await fetch(`/.netlify/functions/shopify-collection-products?id=${collection.id}`);
          const productsResponse = await prodRes.json();

          const collectionProducts = productsResponse.products || [];
          const transformedProducts = collectionProducts
            .map(transformShopifyProduct)
            .filter((p: Product | null) => p !== null);

          return {
            id: collection.id.toString(),
            handle: collection.handle,
            title: collection.title,
            description: collection.body_html || collection.description || '',
            image: collection.image ? {
              url: collection.image.src || collection.image.url,
              alt: collection.image.alt
            } : undefined,
            products: transformedProducts,
            productsCount: transformedProducts.length
          };
        } catch (error) {
          console.error(`Error fetching products for collection ${collection.id}:`, error);
          return {
            id: collection.id.toString(),
            handle: collection.handle,
            title: collection.title,
            description: collection.body_html || collection.description || '',
            image: collection.image ? {
              url: collection.image.src || collection.image.url,
              alt: collection.image.alt
            } : undefined,
            products: [],
            productsCount: 0
          };
        }
      })
    );

    console.log('✅ Collections loaded successfully:', collections.length, 'collections');
    return collections;
  } catch (error) {
    console.error('Error fetching collections from Shopify:', error);
    return [];
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
    }
  } catch (error) {
    console.error('Error updating inventory in Shopify:', error);
    throw error;
  }
};

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

// Get all customers via Shopify Admin API
export const getAllCustomers = async () => {
  try {
    const response = await makeAdminAPIRequest('customers.json?limit=250');
    const customers = response.customers;
    
    return customers.map((customer: any) => ({
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phone: customer.phone,
      ordersCount: customer.orders_count,
      totalSpent: parseFloat(customer.total_spent || '0'),
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      address: customer.default_address ? {
        address1: customer.default_address.address1,
        city: customer.default_address.city,
        province: customer.default_address.province,
        zip: customer.default_address.zip,
        country: customer.default_address.country,
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching customers from Shopify:', error);
    return [];
  }
};

// Get all collections from Shopify
export const getAllCollections = async () => {
  try {
    console.log('🔄 Fetching collections from Shopify...');
    const shopifyCollections = await shopifyClient.collection.fetchAllWithProducts();
    console.log('✅ Collections loaded successfully:', shopifyCollections.length);
    
    const transformedCollections = shopifyCollections.map((collection: any) => ({
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      description: collection.description || '',
      image: collection.image?.src || '',
      products: collection.products?.map(transformShopifyProduct).filter((p: Product | null) => p !== null) || []
    }));
    
    collections = transformedCollections;
    return transformedCollections;
  } catch (error) {
    console.error('Error fetching collections from Shopify:', error);
    return [];
  }
};

// Get single collection by handle
export const getCollectionByHandle = async (handle: string) => {
  try {
    const collection = await shopifyClient.collection.fetchByHandle(handle);
    if (!collection) return null;
    
    return {
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      description: collection.description || '',
      image: collection.image?.src || '',
      products: collection.products?.map(transformShopifyProduct).filter((p: Product | null) => p !== null) || []
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
};

// Get products by collection
export const getProductsByCollection = async (collectionHandle: string): Promise<Product[]> => {
  try {
    const collection = await getCollectionByHandle(collectionHandle);
    return collection?.products || [];
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    return [];
  }
};

// Initialize products cache
export const initializeProducts = (defaultProducts?: Product[]) => {
  if (defaultProducts) {
    products = defaultProducts;
  }
};