import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, RefreshCw, Shield, Clock, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ShippingReturns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} onCartOpen={() => {}} />
      
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Shipping & Returns</h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about shipping and returns
              </p>
            </div>

            <div className="grid gap-8">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">Free</div>
                      <div className="font-semibold mb-1">Standard Shipping</div>
                      <div className="text-sm text-muted-foreground">5-7 business days</div>
                      <div className="text-xs text-muted-foreground mt-2">Orders over $75</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">$15</div>
                      <div className="font-semibold mb-1">Express Shipping</div>
                      <div className="text-sm text-muted-foreground">2-3 business days</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">$25</div>
                      <div className="font-semibold mb-1">Overnight Shipping</div>
                      <div className="text-sm text-muted-foreground">1 business day</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Shipping Details</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Orders are processed within 1-2 business days</li>
                      <li>• You'll receive a tracking number via email</li>
                      <li>• Shipping to all 50 US states</li>
                      <li>• International shipping available to select countries</li>
                      <li>• Orders placed after 2 PM EST ship the next business day</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Returns & Exchanges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Returns & Exchanges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">30-Day Returns</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Return any item within 30 days of delivery for a full refund
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">Free Returns</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Free return shipping on all US orders
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Return Policy</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What can be returned?</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Items in original condition with tags attached</li>
                          <li>• Unworn, unwashed items</li>
                          <li>• Items in original packaging</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">What cannot be returned?</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Worn or damaged items</li>
                          <li>• Items without original tags</li>
                          <li>• Sale items (final sale)</li>
                          <li>• Gift cards</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">How to Return</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                          1
                        </div>
                        <p className="text-sm font-medium">Initiate Return</p>
                        <p className="text-xs text-muted-foreground">Go to your order history and select "Return Item"</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                          2
                        </div>
                        <p className="text-sm font-medium">Print Label</p>
                        <p className="text-xs text-muted-foreground">Print the prepaid return shipping label</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                          3
                        </div>
                        <p className="text-sm font-medium">Ship Back</p>
                        <p className="text-xs text-muted-foreground">Drop off at any USPS location</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exchanges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Exchanges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Need a different size or color? We offer free exchanges within 30 days of delivery.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Size Exchanges</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Free size exchanges</li>
                          <li>• Subject to availability</li>
                          <li>• Processed within 2-3 business days</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Color Exchanges</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Free color exchanges</li>
                          <li>• Subject to availability</li>
                          <li>• Processed within 2-3 business days</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Customer Service</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Our team is here to help with any questions about shipping or returns.
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>📧 support@saltnsoul.com</p>
                        <p>📞 (555) 123-4567</p>
                        <p>🕒 Mon-Fri 9AM-6PM EST</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Quick Links</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Track My Order
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Start a Return
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 