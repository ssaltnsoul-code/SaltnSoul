import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Ruler, 
  ArrowLeft, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  Heart,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SizeChart {
  size: string;
  bust: string;
  waist: string;
  hips: string;
  inseam?: string;
}

const sizeCharts = {
  tops: [
    { size: 'XS', bust: '30-32"', waist: '24-26"', hips: '34-36"' },
    { size: 'S', bust: '32-34"', waist: '26-28"', hips: '36-38"' },
    { size: 'M', bust: '34-36"', waist: '28-30"', hips: '38-40"' },
    { size: 'L', bust: '36-38"', waist: '30-32"', hips: '40-42"' },
    { size: 'XL', bust: '38-40"', waist: '32-34"', hips: '42-44"' },
  ],
  bottoms: [
    { size: 'XS', bust: '30-32"', waist: '24-26"', hips: '34-36"', inseam: '28"' },
    { size: 'S', bust: '32-34"', waist: '26-28"', hips: '36-38"', inseam: '29"' },
    { size: 'M', bust: '34-36"', waist: '28-30"', hips: '38-40"', inseam: '30"' },
    { size: 'L', bust: '36-38"', waist: '30-32"', hips: '40-42"', inseam: '31"' },
    { size: 'XL', bust: '38-40"', waist: '32-34"', hips: '42-44"', inseam: '32"' },
  ]
};

export default function SizeGuide() {
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

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
              <p className="text-lg text-muted-foreground">
                Find your perfect fit with our comprehensive size charts and measurement guide
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* How to Measure */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      How to Measure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Bust</h4>
                        <p className="text-sm text-muted-foreground">
                          Measure around the fullest part of your bust, keeping the tape level and not too tight.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Waist</h4>
                        <p className="text-sm text-muted-foreground">
                          Measure around your natural waistline, keeping the tape comfortably loose.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Hips</h4>
                        <p className="text-sm text-muted-foreground">
                          Measure around the fullest part of your hips, keeping the tape level.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Inseam (for pants)</h4>
                        <p className="text-sm text-muted-foreground">
                          Measure from the crotch to the desired length along the inside of your leg.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Pro Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Measure yourself in your underwear for the most accurate fit</li>
                            <li>• Keep the measuring tape snug but not tight</li>
                            <li>• Measure in front of a mirror to ensure the tape is level</li>
                            <li>• If you're between sizes, we recommend sizing up</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fit Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">True to Size</h4>
                        <p className="text-sm text-muted-foreground">
                          Our products generally run true to size. If you're between sizes, we recommend sizing up for a more comfortable fit.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-pink-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Comfortable Fit</h4>
                        <p className="text-sm text-muted-foreground">
                          Our activewear is designed for comfort and movement. The fabric has stretch for ease of wear.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Size Variations</h4>
                        <p className="text-sm text-muted-foreground">
                          Some styles may fit differently. Check individual product pages for specific fit notes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Size Charts */}
              <div className="space-y-8">
                {/* Tops Size Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Tops Size Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-semibold">Size</th>
                            <th className="text-left py-2 font-semibold">Bust</th>
                            <th className="text-left py-2 font-semibold">Waist</th>
                            <th className="text-left py-2 font-semibold">Hips</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.tops.map((size) => (
                            <tr key={size.size} className="border-b">
                              <td className="py-2 font-medium">{size.size}</td>
                              <td className="py-2 text-muted-foreground">{size.bust}</td>
                              <td className="py-2 text-muted-foreground">{size.waist}</td>
                              <td className="py-2 text-muted-foreground">{size.hips}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottoms Size Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Bottoms Size Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-semibold">Size</th>
                            <th className="text-left py-2 font-semibold">Bust</th>
                            <th className="text-left py-2 font-semibold">Waist</th>
                            <th className="text-left py-2 font-semibold">Hips</th>
                            <th className="text-left py-2 font-semibold">Inseam</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.bottoms.map((size) => (
                            <tr key={size.size} className="border-b">
                              <td className="py-2 font-medium">{size.size}</td>
                              <td className="py-2 text-muted-foreground">{size.bust}</td>
                              <td className="py-2 text-muted-foreground">{size.waist}</td>
                              <td className="py-2 text-muted-foreground">{size.hips}</td>
                              <td className="py-2 text-muted-foreground">{size.inseam}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* International Sizing */}
                <Card>
                  <CardHeader>
                    <CardTitle>International Sizing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-semibold">US</th>
                            <th className="text-left py-2 font-semibold">UK</th>
                            <th className="text-left py-2 font-semibold">EU</th>
                            <th className="text-left py-2 font-semibold">AU</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">XS</td>
                            <td className="py-2">6</td>
                            <td className="py-2">34</td>
                            <td className="py-2">6</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">S</td>
                            <td className="py-2">8</td>
                            <td className="py-2">36</td>
                            <td className="py-2">8</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">M</td>
                            <td className="py-2">10</td>
                            <td className="py-2">38</td>
                            <td className="py-2">10</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">L</td>
                            <td className="py-2">12</td>
                            <td className="py-2">40</td>
                            <td className="py-2">12</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">XL</td>
                            <td className="py-2">14</td>
                            <td className="py-2">42</td>
                            <td className="py-2">14</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Need Help */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Still Unsure About Your Size?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Our customer service team is here to help you find the perfect fit!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/contact')}>
                      Contact Support
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 