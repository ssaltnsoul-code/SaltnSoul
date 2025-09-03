import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { getCollectionByHandle } from '@/lib/api';
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart();

  useEffect(() => {
    const loadCollection = async () => {
      if (!handle) {
        navigate('/');
        return;
      }

      try {
        console.log('🔄 Loading collection:', handle);
        const collectionData = await getCollectionByHandle(handle);
        
        if (!collectionData) {
          navigate('/');
          return;
        }

        console.log('✅ Collection loaded:', collectionData.title);
        setCollection(collectionData);
        setProducts(collectionData.products);
        setFilteredProducts(collectionData.products);
      } catch (error) {
        console.error('❌ Error loading collection:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [handle, navigate]);

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
            <span className="ml-4 text-lg">Loading collection...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar 
          cartItemCount={itemCount}
          onCartOpen={() => setIsCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
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
      
      <main className="pt-20">
        {/* Collection Header */}
        <div className="bg-gradient-to-r from-rose-50 to-neutral-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
              
              {collection.image && (
                <div className="mb-8">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                  />
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {collection.title}
              </h1>
              
              {collection.description && (
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                  {collection.description}
                </p>
              )}
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>{products.length} {products.length === 1 ? 'Product' : 'Products'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">No Products Found</h2>
              <p className="text-muted-foreground mb-8">
                This collection doesn't have any products yet.
              </p>
              <Button onClick={() => navigate('/')}>
                Browse All Products
              </Button>
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

export default Collection;