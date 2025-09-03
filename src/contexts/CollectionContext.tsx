import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { CollectionMapping, WebsiteSection } from '@/types/collection';
import { getAllProducts } from '@/lib/api';

interface CollectionContextType {
  getProductsForSection: (sectionId: string) => Product[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mappings, setMappings] = useState<CollectionMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products and mappings
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load products from Shopify
      const products = await getAllProducts();
      setAllProducts(products);
      
      // Load collection mappings from localStorage
      const savedMappings = localStorage.getItem('collectionMappings');
      if (savedMappings) {
        setMappings(JSON.parse(savedMappings));
      }
    } catch (error) {
      console.error('Error loading collection data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    await loadData();
  };

  const getProductsForSection = (sectionId: string): Product[] => {
    const mapping = mappings.find(m => m.sectionId === sectionId && m.isActive);
    if (!mapping || mapping.productIds.length === 0) {
      // Fallback logic for sections without explicit mappings
      return getFallbackProducts(sectionId);
    }
    
    // Get products based on mapping
    const products = mapping.productIds
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
    
    // Apply sorting based on mapping settings
    return sortProducts(products, mapping.settings.sortBy);
  };

  const getFallbackProducts = (sectionId: string): Product[] => {
    switch (sectionId) {
      case 'hero':
      case 'featured':
        return allProducts.filter(p => p.featured).slice(0, 4);
      case 'new-arrivals':
        return allProducts.slice(0, 8); // Assume newer products are at the beginning
      case 'bestsellers':
        return allProducts.filter(p => p.featured).slice(0, 8);
      case 'women-collection':
        return allProducts.filter(p => 
          p.category.toLowerCase().includes('women') || 
          p.name.toLowerCase().includes('women')
        );
      case 'men-collection':
        return allProducts.filter(p => 
          p.category.toLowerCase().includes('men') || 
          p.name.toLowerCase().includes('men')
        );
      default:
        return [];
    }
  };

  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'created':
        // Assuming newer products have higher IDs or are at the beginning
        return sorted.reverse();
      case 'manual':
      default:
        return sorted; // Keep the manual order from the mapping
    }
  };

  return (
    <CollectionContext.Provider value={{
      getProductsForSection,
      isLoading,
      refreshProducts,
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionProvider');
  }
  return context;
}
