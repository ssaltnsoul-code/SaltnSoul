import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (itemIndex: number) => void;
  updateQuantity: (itemIndex: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('salt_soul_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('salt_soul_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('salt_soul_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, size: string, color: string, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast({
          title: "Updated cart",
          description: `${product.name} quantity updated`,
        });
        return updatedItems;
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
        });
        return [...prevItems, { product, quantity, size, color }];
      }
    });
  };

  const removeItem = (itemIndex: number) => {
    setItems(prevItems => {
      const newItems = prevItems.filter((_, index) => index !== itemIndex);
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
      return newItems;
    });
  };

  const updateQuantity = (itemIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemIndex);
      return;
    }

    setItems(prevItems =>
      prevItems.map((item, index) =>
        index === itemIndex ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('salt_soul_cart');
    toast({
      title: "Cart cleared",
      description: "All items removed from cart",
    });
  };

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}