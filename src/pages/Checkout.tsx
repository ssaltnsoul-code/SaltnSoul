import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, ExternalLink, Truck, Shield, Loader2 } from 'lucide-react';
import { shopifyClient } from '@/lib/shopify';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const { toast } = useToast();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Create Shopify checkout on component mount
  useEffect(() => {
    const createShopifyCheckout = async () => {
      if (items.length === 0) return;
      
      setLoading(true);
      try {
        console.log('Creating Shopify checkout with items:', items);
        
        // Create checkout using Shopify Buy SDK
        const checkout = await shopifyClient.checkout.create();
        console.log('Created checkout:', checkout);
        
        // Transform cart items to Shopify line items
        const lineItems = items.map(item => {
          // Use the variant ID from the cart item, or fallback to first variant
          const variantId = item.variantId || item.product.variants?.[0]?.id || item.product.shopifyId;
          
          return {
            variantId: variantId,
            quantity: item.quantity,
          };
        }).filter(lineItem => lineItem.variantId); // Only include items with valid variant IDs

        console.log('Line items to add:', lineItems);

        if (lineItems.length === 0) {
          throw new Error('No valid product variants found');
        }
        
        // Add line items to checkout
        const updatedCheckout = await shopifyClient.checkout.addLineItems(checkout.id, lineItems);
        console.log('Updated checkout with items:', updatedCheckout);
        
        setCheckoutUrl(updatedCheckout.webUrl);
        
        toast({
          title: 'Checkout Ready',
          description: 'Your secure checkout is ready to complete.',
        });
      } catch (error) {
        console.error('Error creating Shopify checkout:', error);
        toast({
          title: 'Error',
          description: 'Failed to create checkout. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    createShopifyCheckout();
  }, [items, toast]);

  const handleShopifyCheckout = () => {
    if (checkoutUrl) {
      setIsCheckingOut(true);
      // Open checkout in same window for embedded experience
      window.location.href = checkoutUrl;
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some items to continue with checkout</p>
          <Button onClick={() => navigate('/')} className="btn-hero">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">{itemCount} items in your order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Information */}
          <div className="space-y-8">
            {/* Shopify Checkout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Secure Checkout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to Complete Your Order
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    You'll be securely redirected to Shopify's checkout where you can:
                  </p>
                  
                  <div className="space-y-2 text-sm text-left max-w-md mx-auto mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Enter your shipping & billing information</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Choose your preferred payment method</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Select shipping options</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Complete your secure purchase</span>
                    </div>
                  </div>
                  
                  {loading ? (
                    <Button disabled className="w-full" size="lg">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Preparing your checkout...
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleShopifyCheckout}
                      disabled={!checkoutUrl || isCheckingOut}
                      className="w-full"
                      size="lg"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Proceed to Secure Checkout
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Free Returns</span>
                    </div>
                  </div>
                  
                  <div className="text-center text-xs text-muted-foreground mt-4">
                    Secure checkout powered by Shopify
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.size} • {item.color}
                        </p>
                        <p className="text-sm font-semibold">${item.product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Final total including shipping and tax will be calculated at checkout
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}