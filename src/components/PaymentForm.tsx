import { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { processOrder } from '@/lib/api';
import { useCart } from '@/hooks/useCart';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: 'hsl(var(--foreground))',
      fontFamily: 'system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: 'hsl(var(--muted-foreground))',
      },
    },
    invalid: {
      color: 'hsl(var(--destructive))',
      iconColor: 'hsl(var(--destructive))',
    },
  },
};

interface PaymentFormProps {
  total: number;
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    [key: string]: string;
  };
  onPaymentSuccess: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function PaymentForm({
  total,
  formData,
  onPaymentSuccess,
  isProcessing,
  setIsProcessing,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, clearCart } = useCart();
  const [cardErrors, setCardErrors] = useState<{
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  }>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipCode,
            country: formData.country,
          },
        },
      });

      if (methodError) {
        console.error('Payment method creation failed:', methodError);
        toast({
          title: 'Payment Failed',
          description: methodError.message || 'An error occurred while processing your payment.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Process order with real backend
      const orderData = {
        items,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentInfo: {
          cardNumber: paymentMethod.card?.last4 || '****',
          expiryDate: `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`,
          cvv: '***',
        },
      };

      const order = await processOrder(orderData);

      // Store order in localStorage for order confirmation
      localStorage.setItem('lastOrder', JSON.stringify(order));

      // Clear cart after successful order
      clearCart();

      toast({
        title: 'Payment Successful!',
        description: 'Your order has been processed successfully.',
      });

      onPaymentSuccess();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: 'Payment Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (elementType: string) => (event: { error?: { message: string } }) => {
    if (event.error) {
      setCardErrors(prev => ({ ...prev, [elementType]: event.error.message }));
    } else {
      setCardErrors(prev => ({ ...prev, [elementType]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="card-number">Card Number *</Label>
        <div className="p-3 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <CardNumberElement
            id="card-number"
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange('cardNumber')}
          />
        </div>
        {cardErrors.cardNumber && (
          <p className="text-sm text-destructive">{cardErrors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div className="space-y-2">
          <Label htmlFor="card-expiry">Expiry Date *</Label>
          <div className="p-3 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <CardExpiryElement
              id="card-expiry"
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange('cardExpiry')}
            />
          </div>
          {cardErrors.cardExpiry && (
            <p className="text-sm text-destructive">{cardErrors.cardExpiry}</p>
          )}
        </div>

        {/* CVC */}
        <div className="space-y-2">
          <Label htmlFor="card-cvc">CVC *</Label>
          <div className="p-3 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <CardCvcElement
              id="card-cvc"
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange('cardCvc')}
            />
          </div>
          {cardErrors.cardCvc && (
            <p className="text-sm text-destructive">{cardErrors.cardCvc}</p>
          )}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 p-3 rounded-lg">
        <Lock className="h-4 w-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full btn-hero h-12 text-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ${total.toFixed(2)}
          </>
        )}
      </Button>

      {/* Payment Methods */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">We accept</p>
        <div className="flex justify-center gap-2">
          <div className="text-xs font-semibold px-2 py-1 bg-accent rounded">VISA</div>
          <div className="text-xs font-semibold px-2 py-1 bg-accent rounded">MASTERCARD</div>
          <div className="text-xs font-semibold px-2 py-1 bg-accent rounded">AMEX</div>
          <div className="text-xs font-semibold px-2 py-1 bg-accent rounded">DISCOVER</div>
        </div>
      </div>
    </form>
  );
}