import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Our Collection
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Thoughtfully designed activewear that moves with you. Every piece crafted with care and intention.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-primary hover:bg-primary-hover' : ''}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Load More Button */}
      {filteredProducts.length >= 8 && (
        <div className="text-center mt-12">
          <Button variant="outline" className="px-8 py-3">
            Load More Products
          </Button>
        </div>
      )}
    </section>
  );
}