import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
  };

  return (
    <div className="group card-product">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
          {product.originalPrice && (
            <Badge variant="secondary" className="bg-rose-100 text-rose-700">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'}`} 
            />
          </Button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 space-y-2">
          <Button 
            onClick={handleAddToCart}
            className="w-full btn-hero"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/product/${product.handle}`)}
            className="w-full bg-white/90 backdrop-blur-sm"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <h3 
            className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/product/${product.handle}`)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-foreground">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Size
          </label>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  selectedSize === size
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Color: {selectedColor}
          </label>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-primary scale-110'
                    : 'border-neutral-300 hover:border-primary'
                } ${
                  color === 'Rose Pink' ? 'bg-rose-400' :
                  color === 'Black' ? 'bg-neutral-900' :
                  color === 'White' || color === 'Pearl White' ? 'bg-white' :
                  color === 'Navy' ? 'bg-blue-900' :
                  color === 'Sage Green' ? 'bg-green-400' :
                  color === 'Charcoal' ? 'bg-neutral-600' :
                  color === 'Nude' ? 'bg-amber-200' :
                  color === 'Lavender' ? 'bg-purple-300' :
                  color === 'Mint' ? 'bg-emerald-200' :
                  color === 'Grey' ? 'bg-neutral-400' :
                  'bg-neutral-200'
                }`}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}