import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface ShopifyEmbeddedCheckoutProps {
  checkoutId: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function ShopifyEmbeddedCheckout({ 
  checkoutId, 
  onComplete, 
  onError 
}: ShopifyEmbeddedCheckoutProps) {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const checkoutRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Load Shopify's Web Checkout SDK
        const script = document.createElement('script');
        script.src = 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/checkout-web.js';
        script.async = true;
        
        script.onload = () => {
          initializeShopifyCheckout();
        };
        
        script.onerror = () => {
          setError('Failed to load Shopify checkout');
          setIsLoading(false);
        };
        
        document.head.appendChild(script);

        // Cleanup function
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } catch (err) {
        setError('Failed to initialize checkout');
        setIsLoading(false);
        onError?.(err as Error);
      }
    };

    const initializeShopifyCheckout = () => {
      // Check if Shopify's checkout SDK is available
      if (typeof window !== 'undefined' && (window as any).ShopifyCheckout && checkoutRef.current) {
        try {
          // Initialize embedded checkout
          (window as any).ShopifyCheckout.render({
            containerId: checkoutRef.current.id,
            url: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/checkout/${checkoutId}`,
            onComplete: (checkout: any) => {
              console.log('Checkout completed:', checkout);
              toast({
                title: 'Order Complete!',
                description: 'Thank you for your purchase.',
              });
              clearCart();
              onComplete?.();
            },
            onError: (error: any) => {
              console.error('Checkout error:', error);
              setError(error.message || 'Checkout failed');
              onError?.(error);
            },
            onCancel: () => {
              console.log('Checkout cancelled');
              navigate('/checkout');
            }
          });

          setIsLoading(false);
        } catch (err) {
          console.error('Error initializing Shopify checkout:', err);
          setError('Failed to load checkout');
          setIsLoading(false);
          onError?.(err as Error);
        }
      } else {
        setError('Shopify checkout not available');
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [checkoutId, onComplete, onError, navigate, clearCart, toast]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Checkout Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/checkout')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Checkout
            </Button>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading secure checkout...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Shopify Checkout Container */}
      <div 
        id="shopify-checkout-container"
        ref={checkoutRef}
        className={`min-h-[600px] ${isLoading ? 'hidden' : 'block'}`}
      />
    </div>
  );
}