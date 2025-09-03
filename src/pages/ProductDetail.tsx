import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ArrowLeft, Star, Heart, Share } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProduct } from '@/lib/api';
import { Product } from '@/types/product';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load product from Shopify
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        navigate('/');
        return;
      }

      try {
        console.log('🔄 Loading product:', productId);
        const productData = await getProduct(productId);
        
        if (!productData) {
          navigate('/');
          return;
        }

        console.log('✅ Product loaded:', productData.name);
        setProduct(productData);
        
        // Auto-select first available size and color
        if (productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        
        // Auto-select first variant if available
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
        
      } catch (error) {
        console.error('❌ Error loading product:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, navigate]);

  // Update selected variant when size/color changes
  useEffect(() => {
    if (!product || !product.variants) return;

    const matchingVariant = product.variants.find(variant => {
      const hasSize = !selectedSize || variant.selectedOptions.some(option => 
        option.name.toLowerCase().includes('size') && option.value === selectedSize
      );
      const hasColor = !selectedColor || variant.selectedOptions.some(option => 
        option.name.toLowerCase().includes('color') && option.value === selectedColor
      );
      return hasSize && hasColor;
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [selectedSize, selectedColor, product]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    const maxQuantity = selectedVariant?.availableForSale ? 10 : 0;
    setQuantity(Math.min(newQuantity, maxQuantity));
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: 'Please select a color',
        variant: 'destructive',
      });
      return;
    }

    addItem(product, selectedSize || 'One Size', selectedColor || 'Default', quantity);
    
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this amazing product: ${product?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Product link copied to clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar 
          cartItemCount={itemCount}
          onCartOpen={() => setIsCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-4 text-lg">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar 
          cartItemCount={itemCount}
          onCartOpen={() => setIsCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayPrice = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.compareAtPrice || product.originalPrice;
  const isOnSale = originalPrice && originalPrice > displayPrice;
  const isInStock = selectedVariant?.availableForSale ?? product.inStock;

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItemCount={itemCount}
        onCartOpen={() => setIsCartOpen(true)}
      />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <button onClick={() => navigate('/')} className="hover:text-foreground">
              Home
            </button>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Thumbnail images would go here if multiple images available */}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {product.category}
                      </Badge>
                      {product.featured && (
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {isOnSale && originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <Badge variant="destructive">
                        Save ${(originalPrice - displayPrice).toFixed(2)}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {isInStock ? (
                    <Badge variant="secondary" className="text-green-700 bg-green-50">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Size {selectedSize && <span className="font-normal text-muted-foreground">- {selectedSize}</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[3rem]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Color {selectedColor && <span className="font-normal text-muted-foreground">- {selectedColor}</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className="min-w-[4rem]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isInStock ? `Add to Cart - $${(displayPrice * quantity).toFixed(2)}` : 'Out of Stock'}
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>

              {/* Product Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU</span>
                      <span>{selectedVariant?.id || product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="capitalize">{product.category}</span>
                    </div>
                    {product.variants && product.variants.length > 1 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variants</span>
                        <span>{product.variants.length} available</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}