const { createAdminApiClient } = require('@shopify/admin-api-client');

// Initialize Shopify Admin API client
const client = createAdminApiClient({
  storeDomain: process.env.VITE_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-01',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { action, ...params } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'getProducts':
        return await getProducts(headers);
      
      case 'createProduct':
        return await createProduct(params.product, headers);
      
      case 'updateProduct':
        return await updateProduct(params.id, params.product, headers);
      
      case 'deleteProduct':
        return await deleteProduct(params.id, headers);
      
      case 'getOrders':
        return await getOrders(headers);
      
      case 'updateOrder':
        return await updateOrder(params.id, params.order, headers);
      
      case 'getCustomers':
        return await getCustomers(headers);
      
      case 'updateInventory':
        return await updateInventory(params.variantId, params.quantity, headers);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('Shopify Admin API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
    };
  }
};

// Get all products from Shopify
async function getProducts(headers) {
  try {
    const query = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              status
              productType
              vendor
              tags
              featuredImage {
                url
                altText
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    price
                    compareAtPrice
                    inventoryQuantity
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const response = await client.request(query, {
      variables: { first: 250 }
    });

    const products = response.data.products.edges.map(({ node }) => {
      const variants = node.variants.edges.map(({ node: variant }) => variant);
      
      // Extract sizes and colors from variants
      const sizes = Array.from(new Set(
        variants.flatMap(variant => 
          variant.selectedOptions
            .filter(option => option.name.toLowerCase() === 'size')
            .map(option => option.value)
        )
      ));
      
      const colors = Array.from(new Set(
        variants.flatMap(variant => 
          variant.selectedOptions
            .filter(option => option.name.toLowerCase() === 'color')
            .map(option => option.value)
        )
      ));

      return {
        id: node.id.split('/').pop(),
        name: node.title,
        description: node.description || '',
        price: parseFloat(variants[0]?.price || '0'),
        original_price: variants[0]?.compareAtPrice ? parseFloat(variants[0].compareAtPrice) : null,
        image_url: node.featuredImage?.url || node.images.edges[0]?.node.url || '',
        category: node.productType || 'Activewear',
        sizes: sizes.length > 0 ? sizes : ['One Size'],
        colors: colors.length > 0 ? colors : ['Default'],
        in_stock: variants.some(v => v.availableForSale),
        featured: node.tags.includes('featured'),
        inventory_count: variants.reduce((total, variant) => total + (variant.inventoryQuantity || 0), 0),
        created_at: node.createdAt,
        updated_at: node.updatedAt,
        handle: node.handle,
        variants: variants,
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

// Create product in Shopify
async function createProduct(productData, headers) {
  try {
    const mutation = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      title: productData.name,
      description: productData.description,
      productType: productData.category,
      vendor: 'Salt & Soul',
      tags: productData.featured ? ['featured'] : [],
      images: productData.image_url ? [{ src: productData.image_url }] : [],
      variants: [{
        price: productData.price.toString(),
        compareAtPrice: productData.original_price ? productData.original_price.toString() : null,
        inventoryQuantity: productData.inventory_count || 0,
        inventoryManagement: 'SHOPIFY',
      }],
    };

    const response = await client.request(mutation, {
      variables: { input }
    });

    if (response.data.productCreate.userErrors.length > 0) {
      throw new Error(response.data.productCreate.userErrors[0].message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data.productCreate.product),
    };
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

// Update product in Shopify
async function updateProduct(productId, productData, headers) {
  try {
    const mutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      id: `gid://shopify/Product/${productId}`,
      title: productData.name,
      description: productData.description,
      productType: productData.category,
      tags: productData.featured ? ['featured'] : [],
    };

    const response = await client.request(mutation, {
      variables: { input }
    });

    if (response.data.productUpdate.userErrors.length > 0) {
      throw new Error(response.data.productUpdate.userErrors[0].message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data.productUpdate.product),
    };
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

// Delete product from Shopify
async function deleteProduct(productId, headers) {
  try {
    const mutation = `
      mutation productDelete($input: ProductDeleteInput!) {
        productDelete(input: $input) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await client.request(mutation, {
      variables: { 
        input: { 
          id: `gid://shopify/Product/${productId}` 
        }
      }
    });

    if (response.data.productDelete.userErrors.length > 0) {
      throw new Error(response.data.productDelete.userErrors[0].message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

// Get orders from Shopify
async function getOrders(headers) {
  try {
    const query = `
      query getOrders($first: Int!) {
        orders(first: $first) {
          edges {
            node {
              id
              name
              email
              phone
              createdAt
              updatedAt
              totalPrice {
                amount
                currencyCode
              }
              subtotalPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              totalShippingPrice {
                amount
                currencyCode
              }
              fulfillmentStatus
              financialStatus
              customer {
                id
                firstName
                lastName
                email
                phone
              }
              shippingAddress {
                firstName
                lastName
                address1
                address2
                city
                province
                zip
                country
              }
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    title
                    quantity
                    variant {
                      id
                      title
                      price
                      product {
                        id
                        title
                        featuredImage {
                          url
                        }
                      }
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.request(query, {
      variables: { first: 250 }
    });

    const orders = response.data.orders.edges.map(({ node }) => ({
      id: node.name, // Use order name (e.g., #1001) instead of GraphQL ID
      customer: {
        name: `${node.customer?.firstName || ''} ${node.customer?.lastName || ''}`.trim() || 'Guest',
        email: node.email || node.customer?.email || '',
        address: {
          line1: node.shippingAddress?.address1 || '',
          city: node.shippingAddress?.city || '',
          state: node.shippingAddress?.province || '',
          zipCode: node.shippingAddress?.zip || '',
          country: node.shippingAddress?.country || '',
        },
      },
      items: node.lineItems.edges.map(({ node: item }) => ({
        product: {
          name: item.title,
          image: item.variant?.product?.featuredImage?.url || '',
          price: parseFloat(item.variant?.price || '0'),
        },
        quantity: item.quantity,
        size: item.variant?.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size')?.value || 'N/A',
        color: item.variant?.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color')?.value || 'N/A',
      })),
      total: parseFloat(node.totalPrice?.amount || '0'),
      subtotal: parseFloat(node.subtotalPrice?.amount || '0'),
      tax: parseFloat(node.totalTax?.amount || '0'),
      shipping: parseFloat(node.totalShippingPrice?.amount || '0'),
      status: node.fulfillmentStatus?.toLowerCase() || 'pending',
      paymentStatus: node.financialStatus?.toLowerCase() || 'pending',
      orderDate: node.createdAt,
      shippingMethod: 'standard', // Default since Shopify doesn't expose this easily
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
}

// Get customers from Shopify
async function getCustomers(headers) {
  try {
    const query = `
      query getCustomers($first: Int!) {
        customers(first: $first) {
          edges {
            node {
              id
              firstName
              lastName
              email
              phone
              createdAt
              updatedAt
              ordersCount
              totalSpent {
                amount
                currencyCode
              }
              lastOrder {
                createdAt
              }
              defaultAddress {
                city
                province
                country
              }
              tags
              state
            }
          }
        }
      }
    `;

    const response = await client.request(query, {
      variables: { first: 250 }
    });

    const customers = response.data.customers.edges.map(({ node }) => ({
      id: node.id.split('/').pop(),
      name: `${node.firstName || ''} ${node.lastName || ''}`.trim() || 'Unknown',
      email: node.email || '',
      phone: node.phone,
      address: {
        city: node.defaultAddress?.city || '',
        state: node.defaultAddress?.province || '',
        country: node.defaultAddress?.country || '',
      },
      totalOrders: node.ordersCount || 0,
      totalSpent: parseFloat(node.totalSpent?.amount || '0'),
      joinDate: node.createdAt,
      lastOrderDate: node.lastOrder?.createdAt || node.createdAt,
      status: node.state === 'ENABLED' ? 'active' : 'inactive',
      loyaltyTier: getLoyaltyTier(parseFloat(node.totalSpent?.amount || '0')),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }
}

// Update inventory in Shopify
async function updateInventory(variantId, quantity, headers) {
  try {
    const mutation = `
      mutation inventoryAdjustQuantity($input: InventoryAdjustQuantityInput!) {
        inventoryAdjustQuantity(input: $input) {
          inventoryLevel {
            id
            available
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // First, get the inventory item ID for the variant
    const variantQuery = `
      query getVariant($id: ID!) {
        productVariant(id: $id) {
          inventoryItem {
            id
          }
        }
      }
    `;

    const variantResponse = await client.request(variantQuery, {
      variables: { id: `gid://shopify/ProductVariant/${variantId}` }
    });

    const inventoryItemId = variantResponse.data.productVariant.inventoryItem.id;

    // Get the first location (assuming single location setup)
    const locationsQuery = `
      query getLocations($first: Int!) {
        locations(first: $first) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const locationsResponse = await client.request(locationsQuery, {
      variables: { first: 1 }
    });

    const locationId = locationsResponse.data.locations.edges[0].node.id;

    // Update inventory
    const response = await client.request(mutation, {
      variables: {
        input: {
          inventoryItemId,
          locationId,
          quantityDelta: quantity, // This should be the delta, not absolute quantity
        }
      }
    });

    if (response.data.inventoryAdjustQuantity.userErrors.length > 0) {
      throw new Error(response.data.inventoryAdjustQuantity.userErrors[0].message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data.inventoryAdjustQuantity.inventoryLevel),
    };
  } catch (error) {
    throw new Error(`Failed to update inventory: ${error.message}`);
  }
}

// Update order status in Shopify
async function updateOrder(orderId, orderData, headers) {
  try {
    const mutation = `
      mutation orderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await client.request(mutation, {
      variables: {
        input: {
          id: `gid://shopify/Order/${orderId}`,
          tags: orderData.tags || [],
        }
      }
    });

    if (response.data.orderUpdate.userErrors.length > 0) {
      throw new Error(response.data.orderUpdate.userErrors[0].message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data.orderUpdate.order),
    };
  } catch (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
}

// Helper function to determine loyalty tier
function getLoyaltyTier(totalSpent) {
  if (totalSpent >= 1000) return 'platinum';
  if (totalSpent >= 500) return 'gold';
  if (totalSpent >= 200) return 'silver';
  return 'bronze';
}