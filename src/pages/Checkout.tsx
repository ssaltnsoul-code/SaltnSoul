import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
<<<<<<< HEAD
import { ArrowLeft, ExternalLink, Truck, Shield } from 'lucide-react';
import { initializeCart, addToCart, getCart } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
=======
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { createShopifyCheckout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ShopifyEmbeddedCheckout } from '@/components/ShopifyEmbeddedCheckout';
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, itemCount } = useCart();
  const { toast } = useToast();
<<<<<<< HEAD
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
=======
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    checkoutId: string;
    checkoutUrl: string;
  } | null>(null);
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    shippingMethod: 'standard',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const shippingCosts = {
    standard: 0,
    express: 15,
    overnight: 25
  };

  const shippingCost = shippingCosts[formData.shippingMethod as keyof typeof shippingCosts];
  const tax = total * 0.08; // 8% tax rate
  const finalTotal = total + shippingCost + tax;

<<<<<<< HEAD
  // Create Shopify checkout on component mount
  useEffect(() => {
    const createCheckout = async () => {
      if (items.length === 0) return;
      
      setLoading(true);
      try {
        // Initialize cart and add items
        const cart = await initializeCart();
        
        // Add each cart item to Shopify checkout
        for (const item of items) {
          // Find variant ID - for now we'll use a placeholder
          // In a real implementation, you'd need to map your products to Shopify variants
          const variantId = item.variantId || item.product.variants?.[0]?.id;
          if (variantId) {
            await addToCart(variantId, item.quantity);
          }
        }
        
        const updatedCart = await getCart();
        setCheckoutUrl(updatedCart.webUrl);
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

    createCheckout();
  }, [items, toast]);

  const handleShopifyCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };

=======
  const handleProceedToCheckout = async () => {
    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required shipping information.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createShopifyCheckout({
        items,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      });

      setCheckoutData(result);
      setShowEmbeddedCheckout(true);
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Checkout Error',
        description: 'Unable to proceed to checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutComplete = () => {
    // Clear cart and redirect to confirmation
    navigate('/order-confirmation');
  };

  const handleCheckoutError = (error: Error) => {
    console.error('Embedded checkout error:', error);
    toast({
      title: 'Checkout Error',
      description: 'There was an issue with the checkout. Please try again.',
      variant: 'destructive',
    });
    setShowEmbeddedCheckout(false);
  };

>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
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

  // Show embedded checkout if we have checkout data
  if (showEmbeddedCheckout && checkoutData) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmbeddedCheckout(false)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Complete Your Order</h1>
              <p className="text-muted-foreground">Secure checkout powered by Shopify</p>
            </div>
          </div>

          <ShopifyEmbeddedCheckout
            checkoutId={checkoutData.checkoutId}
            onComplete={handleCheckoutComplete}
            onError={handleCheckoutError}
          />
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
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll send your order confirmation here
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="CA"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="12345"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(shippingCosts).map(([method, cost]) => (
                  <label key={method} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method}
                        checked={formData.shippingMethod === method}
                        onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <p className="font-medium capitalize">
                          {method} Shipping
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {method === 'standard' ? '5-7 business days' :
                           method === 'express' ? '2-3 business days' :
                           '1 business day'}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {cost === 0 ? 'Free' : `$${cost}`}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>

<<<<<<< HEAD
            {/* Shopify Checkout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Complete Purchase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Complete your purchase securely through Shopify's checkout system.
                </p>
                
                {loading ? (
                  <Button disabled className="w-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating checkout...
                  </Button>
                ) : (
                  <Button 
                    onClick={handleShopifyCheckout}
                    disabled={!checkoutUrl}
                    className="w-full"
                    size="lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Complete Order - ${finalTotal.toFixed(2)}
                  </Button>
                )}
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout powered by Shopify</span>
=======
            {/* Proceed to Embedded Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Complete Your Order?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Click below to proceed to our secure embedded checkout to complete your payment.
                  </p>
                  
                  <div className="bg-accent/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Shield className="h-4 w-4" />
                      Secure Embedded Checkout
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Multiple payment options (Credit cards, PayPal, Apple Pay, etc.)</li>
                      <li>• Industry-leading security and encryption</li>
                      <li>• Express checkout options available</li>
                      <li>• Seamless checkout experience without leaving our site</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={isProcessing}
                    className="w-full btn-hero h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating checkout...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Continue to Payment
                      </>
                    )}
                  </Button>
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
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
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
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