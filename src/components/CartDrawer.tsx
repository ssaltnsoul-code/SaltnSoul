import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/product';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

export function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartDrawerProps) {
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some beautiful pieces to get started</p>
              <Button onClick={onClose} className="btn-hero">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.color}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-foreground">
                        ${item.product.price}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive mt-2 p-0 h-auto"
                      onClick={() => onRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button 
                className="w-full btn-hero"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}