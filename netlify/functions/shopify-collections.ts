import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  try {
    const domain = process.env.VITE_SHOPIFY_STORE_URL || process.env.SHOPIFY_STORE_URL;
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!domain || !adminToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Shopify configuration' })
      };
    }

    const url = `https://${domain}/admin/api/2024-01/collections.json?limit=250`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    };
  }
};

export { handler };
