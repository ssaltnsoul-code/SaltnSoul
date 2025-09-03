const crypto = require('crypto');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Verify webhook signature from Shopify
    const hmac = event.headers['x-shopify-hmac-sha256'];
    const body = event.body;
    const shopifyWebhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (shopifyWebhookSecret && hmac) {
      const hash = crypto
        .createHmac('sha256', shopifyWebhookSecret)
        .update(body, 'utf8')
        .digest('base64');

      if (hash !== hmac) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }

    const topic = event.headers['x-shopify-topic'];
    const shopDomain = event.headers['x-shopify-shop-domain'];
    const data = JSON.parse(body);

    console.log(`Received webhook: ${topic} from ${shopDomain}`);

    // Handle different webhook events
    switch (topic) {
      case 'orders/create':
        console.log('New order created:', data.id);
        // Handle new order logic here
        break;
        
      case 'orders/updated':
        console.log('Order updated:', data.id);
        // Handle order update logic here
        break;
        
      case 'orders/fulfilled':
        console.log('Order fulfilled:', data.id);
        // Handle order fulfillment logic here
        break;
        
      case 'products/create':
        console.log('Product created:', data.id);
        // Handle new product logic here
        break;
        
      case 'products/update':
        console.log('Product updated:', data.id);
        // Handle product update logic here
        break;
        
      default:
        console.log('Unhandled webhook topic:', topic);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Webhook processing failed',
        details: error.message 
      }),
    };
  }
};