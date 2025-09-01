import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ArrowLeft, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { products as initialProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts, initializeProducts } from '@/lib/api';
import { Product } from '@/types/product';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Initialize products with default data if needed
        initializeProducts(initialProducts);
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to initial products if API fails
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const product = products.find(p => p.id === productId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selection required",
        description: "Please select both size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addItem(product, selectedSize, selectedColor, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{product.category}</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Gallery Placeholder */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md border bg-muted" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.featured && (
                <Badge variant="default" className="bg-rose-500">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(24 reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive" className="bg-green-600">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className="h-10"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                  className="h-10"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Add to Cart */}
          <div className="space-y-4">
            <Button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full h-12 text-lg"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            {!product.inStock && (
              <p className="text-sm text-muted-foreground text-center">
                This item is currently out of stock. Check back soon!
              </p>
            )}
          </div>

          {/* Product Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>Bamboo blend, moisture-wicking</span>
                </div>
                <div className="flex justify-between">
                  <span>Care:</span>
                  <span>Machine wash cold, tumble dry low</span>
                </div>
                <div className="flex justify-between">
                  <span>Fit:</span>
                  <span>True to size, medium compression</span>
                </div>
                <div className="flex justify-between">
                  <span>Origin:</span>
                  <span>Made in USA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Card key={relatedProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square overflow-hidden rounded-md mb-3">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{relatedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">${relatedProduct.price}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
} 