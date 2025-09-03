import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Mail, 
  Truck, 
  CreditCard, 
  Home,
  Download,
  Phone,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<{
    id: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      size: string;
      color: string;
      price: number;
    }>;
    customerInfo: {
      name: string;
      email: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    };
    total: number;
    subtotal: number;
    status: string;
    createdAt: string;
    estimatedDelivery: string;
    paymentIntentId?: string;
    paymentMethod?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get session_id from URL parameters
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          // Fallback to localStorage for backward compatibility
          const lastOrder = localStorage.getItem('lastOrder');
          if (lastOrder) {
            const parsedOrder = JSON.parse(lastOrder);
            setOrderData(parsedOrder);
            localStorage.removeItem('lastOrder'); // Clean up
          } else {
            throw new Error('No order information found');
          }
          return;
        }

        // Fetch order details from Stripe session
        const response = await fetch(`/.netlify/functions/checkout-session-status?session_id=${sessionId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to retrieve order details');
        }

        const sessionData = await response.json();
        
        if (sessionData.status !== 'paid') {
          throw new Error('Payment was not completed successfully');
        }

        setOrderData(sessionData);
        
        // Clear cart since payment was successful
        clearCart();

        // Store order in localStorage as backup
        localStorage.setItem('lastOrder', JSON.stringify(sessionData));

      } catch (err) {
        console.error('Error fetching order details:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load order details';
        setError(errorMessage);
        
        toast({
          title: 'Order Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, navigate, clearCart, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-background pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-8">
            {error || "We couldn't find your order details. Please check your email for confirmation or contact support."}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="btn-hero">
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const orderNumber = orderData.id.toUpperCase();
  const orderDate = new Date(orderData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const estimatedDelivery = new Date(orderData.estimatedDelivery).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. We've received your order and will send you a confirmation email shortly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-mono font-semibold">{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{new Date(orderData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Paid
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Status</span>
                  <Badge variant="secondary" className="capitalize">{orderData.status}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{orderData.customerInfo.name}</p>
                  <div className="text-muted-foreground">
                    <p>{orderData.customerInfo.address}</p>
                    <p>
                      {orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}
                    </p>
                    <p>United States</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold">5-7 business days</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We'll send order updates to:
                </p>
                <p className="font-semibold">{orderData.customerInfo.email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {item.productName.substring(0, 3)}
                          </span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.productName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.size} • {item.color}
                        </p>
                        <p className="text-sm font-semibold">${item.price}</p>
                      </div>
                  </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${(orderData.subtotal || orderData.total).toFixed(2)}</span>
                  </div>
                  {orderData.total !== orderData.subtotal && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Included</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>Included</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method</span>
                  </div>
                  <p className="font-semibold">Credit Card ending in ****</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full btn-hero"
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>

            {/* Support */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our customer support team
                  </p>
                  <div className="flex justify-center gap-4 pt-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  On orders over $75
                </p>
              </div>
              <div>
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  30-day return policy
                </p>
              </div>
              <div>
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Order Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Track your order via email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}