import type { Handler } from '@netlify/functions';

const ADMIN_API = '2024-01';

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

    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : undefined;

    if (method === 'POST') {
      const res = await fetch(`https://${domain}/admin/api/${ADMIN_API}/products.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    if (method === 'PUT') {
      const id = body?.product?.id || body?.id;
      if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing product id' }) };
      const res = await fetch(`https://${domain}/admin/api/${ADMIN_API}/products/${id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    if (method === 'DELETE') {
      const id = event.queryStringParameters?.id;
      if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id parameter' }) };
      const res = await fetch(`https://${domain}/admin/api/${ADMIN_API}/products/${id}.json`, {
        method: 'DELETE',
        headers: {
          'X-Shopify-Access-Token': adminToken,
        },
      });
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    };
  }
};

export { handler };
