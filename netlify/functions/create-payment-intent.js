const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { amount, currency = 'usd' } = JSON.parse(event.body);

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to create payment intent',
        details: error.message 
      }),
    };
  }
}; 