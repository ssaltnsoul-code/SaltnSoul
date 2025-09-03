export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured?: boolean;
  stockQuantity?: number;
  // Shopify-specific fields
  handle?: string;
  shopifyId?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  // Shopify-specific fields
  variantId?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}