<<<<<<< HEAD
import Client from 'shopify-buy';

// Initialize Shopify client
const domain = import.meta.env.VITE_SHOPIFY_STORE_URL;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !storefrontAccessToken) {
  throw new Error('Missing Shopify configuration. Please check your environment variables.');
}

export const shopifyClient = Client.buildClient({
  domain,
  storefrontAccessToken,
});

// Admin API configuration
export const SHOPIFY_ADMIN_CONFIG = {
  storeName: domain.replace('.myshopify.com', ''),
  apiVersion: '2024-01',
  accessToken: import.meta.env.VITE_SHOPIFY_ADMIN_TOKEN,
};

// Helper to make Admin API requests
export const makeAdminAPIRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `https://${domain}/admin/api/${SHOPIFY_ADMIN_CONFIG.apiVersion}/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_CONFIG.accessToken!,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Admin API request failed: ${response.statusText}`);
  }

  return response.json();
};
=======
// Shopify Storefront API for frontend operations
const shopifyDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export const shopifyStorefront = {
  domain: shopifyDomain,
  storefrontAccessToken: storefrontToken,
};

// GraphQL queries for Shopify Storefront API
export const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                originalSrc
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                availableForSale
                quantityAvailable
              }
            }
          }
          tags
          productType
          vendor
          availableForSale
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            originalSrc
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            availableForSale
            quantityAvailable
          }
        }
      }
      tags
      productType
      vendor
      availableForSale
    }
  }
`;

export const CHECKOUT_CREATE_MUTATION = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        totalTax {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalPrice {
          amount
          currencyCode
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

// Utility function to make GraphQL requests to Shopify Storefront API
export const shopifyStorefrontFetch = async (query: string, variables: any = {}) => {
  if (!shopifyDomain || !storefrontToken) {
    throw new Error('Shopify configuration missing');
  }

  const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
};

// Transform Shopify product to our Product type
export const transformShopifyProduct = (shopifyProduct: any) => {
  const variants = shopifyProduct.variants.edges.map((edge: any) => edge.node);
  const images = shopifyProduct.images.edges.map((edge: any) => edge.node);
  
  // Extract sizes and colors from variants
  const sizes = Array.from(new Set(
    variants.flatMap((variant: any) => 
      variant.selectedOptions
        .filter((option: any) => option.name.toLowerCase() === 'size')
        .map((option: any) => option.value)
    )
  ));
  
  const colors = Array.from(new Set(
    variants.flatMap((variant: any) => 
      variant.selectedOptions
        .filter((option: any) => option.name.toLowerCase() === 'color')
        .map((option: any) => option.value)
    )
  ));

  return {
    id: shopifyProduct.id.split('/').pop(), // Extract ID from GraphQL ID
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    originalPrice: shopifyProduct.compareAtPriceRange.minVariantPrice 
      ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    image: images[0]?.originalSrc || '/placeholder.svg',
    category: shopifyProduct.productType || 'Activewear',
    sizes: sizes.length > 0 ? sizes : ['One Size'],
    colors: colors.length > 0 ? colors : ['Default'],
    inStock: shopifyProduct.availableForSale,
    featured: shopifyProduct.tags.includes('featured'),
    stockQuantity: variants.reduce((total: number, variant: any) => 
      total + (variant.quantityAvailable || 0), 0
    ),
    handle: shopifyProduct.handle,
    variants,
  };
};

// Database types for Shopify integration
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        availableForSale: boolean;
        quantityAvailable: number;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        id: string;
        originalSrc: string;
        altText: string;
      };
    }>;
  };
  tags: string[];
  productType: string;
  availableForSale: boolean;
}
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
