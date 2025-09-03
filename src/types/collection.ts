import { Product } from './product';

export interface WebsiteSection {
  id: string;
  name: string;
  displayName: string;
  description: string;
  maxProducts?: number;
  type: 'hero' | 'featured' | 'collection' | 'category' | 'new-arrivals' | 'bestsellers';
}

export interface CollectionMapping {
  id: string;
  sectionId: string;
  shopifyCollectionId?: string;
  productIds: string[];
  settings: {
    showTitle: boolean;
    showDescription: boolean;
    layout: 'grid' | 'carousel' | 'list';
    productsPerRow: number;
    sortBy: 'manual' | 'price-asc' | 'price-desc' | 'name' | 'created';
  };
  isActive: boolean;
  priority: number;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt?: string;
  };
  products: Product[];
  productsCount: number;
}

export interface CollectionManagerState {
  sections: WebsiteSection[];
  mappings: CollectionMapping[];
  shopifyCollections: ShopifyCollection[];
  selectedProducts: Product[];
}
