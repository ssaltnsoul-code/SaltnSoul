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
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}