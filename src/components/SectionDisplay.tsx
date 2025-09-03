import React from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { useCollections } from '@/contexts/CollectionContext';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { ChevronRight } from 'lucide-react';

interface SectionDisplayProps {
  sectionId: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
  layout?: 'grid' | 'carousel' | 'list';
  productsPerRow?: number;
  maxProducts?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
  className?: string;
}

export function SectionDisplay({
  sectionId,
  title,
  description,
  showHeader = true,
  layout = 'grid',
  productsPerRow = 4,
  maxProducts,
  showViewAll = false,
  viewAllLink,
  className = '',
}: SectionDisplayProps) {
  const { getProductsForSection, isLoading } = useCollections();
  const { addToCart } = useCart();

  const products = getProductsForSection(sectionId);
  const displayProducts = maxProducts ? products.slice(0, maxProducts) : products;

  const handleAddToCart = async (product: Product, size: string, color: string) => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        color,
      }, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <section className={`py-12 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return null; // Don't render empty sections
  }

  const getGridColumns = () => {
    switch (productsPerRow) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 6: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <section className={`py-12 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {showHeader && (title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Products Display */}
        {layout === 'grid' && (
          <div className={`grid ${getGridColumns()} gap-6`}>
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {layout === 'carousel' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ width: `${displayProducts.length * 280}px` }}>
              {displayProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-64">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {layout === 'list' && (
          <div className="space-y-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="flex gap-6 p-6 border rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                    <Button onClick={() => handleAddToCart(product, 'M', 'Black')}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {showViewAll && viewAllLink && products.length > displayProducts.length && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="px-6 py-3"
              onClick={() => window.location.href = viewAllLink}
            >
              View All ({products.length} products)
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
