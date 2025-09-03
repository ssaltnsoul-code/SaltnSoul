import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { FeaturedSection } from '@/components/FeaturedSection';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
// Remove import of initialProducts - we'll fetch from Shopify
import { Product } from '@/types/product';
import { getAllProducts } from '@/lib/api';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart();

  // Load products from Shopify on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
<<<<<<< HEAD
        console.error('Error loading products from Shopify:', error);
        // Set empty array if Shopify fails
=======
        console.error('Error loading products:', error);
        // Fallback to empty array if Shopify API fails
>>>>>>> 4b0fd3b1355cb544399d9390223c6c502f17958a
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Refresh products every 30 seconds to catch admin updates
    const interval = setInterval(() => {
      getAllProducts().then(productsData => {
        if (productsData && productsData.length > 0) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
      }).catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
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
