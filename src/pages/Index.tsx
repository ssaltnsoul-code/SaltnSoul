import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { FeaturedSection } from '@/components/FeaturedSection';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { products as initialProducts } from '@/data/products';
import { Product } from '@/types/product';
import { getAllProducts, initializeProducts } from '@/lib/api';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart();

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Initialize products with default data if needed
        initializeProducts(initialProducts);
        const productsData = await getAllProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to initial products if API fails
        setProducts(initialProducts);
        setFilteredProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItemCount={itemCount}
        onCartOpen={() => setIsCartOpen(true)}
      />
      
      <main>
        <HeroSection />
        <FeaturedSection />
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <SearchAndFilter 
                products={products}
                onFilterChange={setFilteredProducts}
              />
              <ProductGrid 
                products={filteredProducts}
                onAddToCart={addItem}
              />
            </>
          )}
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
};

export default Index;
