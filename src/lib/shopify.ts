import Client from 'shopify-buy';

// Initialize Shopify client
const domain = import.meta.env.VITE_SHOPIFY_STORE_URL;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn('Missing Shopify configuration. Products may not load properly.');
  console.log('Domain:', domain);
  console.log('Token:', storefrontAccessToken ? 'Present' : 'Missing');
}

export const shopifyClient = Client.buildClient({
  domain: domain || '',
  storefrontAccessToken: storefrontAccessToken || '',
});

// Admin API configuration
export const SHOPIFY_ADMIN_CONFIG = {
  storeName: domain?.replace('.myshopify.com', '') || '',
  apiVersion: '2024-01',
  accessToken: import.meta.env.VITE_SHOPIFY_ADMIN_TOKEN,
};

// Helper to make Admin API requests
export const makeAdminAPIRequest = async (endpoint: string, options: RequestInit = {}) => {
  if (!domain || !SHOPIFY_ADMIN_CONFIG.accessToken) {
    throw new Error('Missing Shopify Admin configuration');
  }
  
  const url = `https://${domain}/admin/api/${SHOPIFY_ADMIN_CONFIG.apiVersion}/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_CONFIG.accessToken,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Admin API request failed: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Admin API request failed: ${response.statusText}`);
  }

  return response.json();
};