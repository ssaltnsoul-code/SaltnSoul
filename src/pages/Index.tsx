import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSection } from '@/components/FeaturedSection';
import { SectionDisplay } from '@/components/SectionDisplay';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useCollections } from '@/contexts/CollectionContext';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { isLoading } = useCollections();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your Shopify products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItemCount={itemCount}
        onCartOpen={() => setIsCartOpen(true)}
      />
      
      <main>
        <HeroSection />
        
        {/* Hero Products Section - Admin configurable */}
        <SectionDisplay
          sectionId="hero"
          title="Featured Products"
          description="Discover our most popular pieces, loved by athletes everywhere"
          maxProducts={4}
          productsPerRow={4}
          showViewAll={true}
          viewAllLink="/collections/featured"
          className="bg-white"
        />
        
        <FeaturedSection />
        
        {/* New Arrivals Section - Admin configurable */}
        <SectionDisplay
          sectionId="new-arrivals"
          title="New Arrivals"
          description="Fresh styles just dropped. Be the first to wear our latest designs"
          maxProducts={8}
          productsPerRow={4}
          showViewAll={true}
          viewAllLink="/collections/new-arrivals"
          className="bg-neutral-50"
        />
        
        {/* Best Sellers Section - Admin configurable */}
        <SectionDisplay
          sectionId="bestsellers"
          title="Best Sellers"
          description="Our customers' favorites - see what everyone's talking about"
          maxProducts={6}
          productsPerRow={3}
          showViewAll={true}
          viewAllLink="/collections/bestsellers"
          className="bg-white"
        />
        
        {/* Women's Collection Section - Admin configurable */}
        <SectionDisplay
          sectionId="women-collection"
          title="Women's Collection"
          description="Empowering activewear designed for strength, style, and comfort"
          maxProducts={8}
          productsPerRow={4}
          showViewAll={true}
          viewAllLink="/collections/women"
          className="bg-rose-50"
        />
        
        {/* Men's Collection Section - Admin configurable */}
        <SectionDisplay
          sectionId="men-collection"
          title="Men's Collection"
          description="Performance gear built for every workout, every day"
          maxProducts={8}
          productsPerRow={4}
          showViewAll={true}
          viewAllLink="/collections/men"
          className="bg-blue-50"
        />
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
