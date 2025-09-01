import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Missing Stripe publishable key. Payment functionality will be disabled.');
}

export const stripePromise = loadStripe(
  stripePublishableKey || 'pk_test_placeholder'
);

// Payment intent creation (this would typically be handled by your backend)
export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // Fallback to mock payment for development
    return {
      clientSecret: 'mock_client_secret',
      id: `pi_mock_${Date.now()}`,
    };
  }
};

// Mock payment processing for development
export const processMockPayment = async (amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  return {
    success: true,
    paymentIntentId: `pi_mock_${Date.now()}`,
    amount,
  };
}; 