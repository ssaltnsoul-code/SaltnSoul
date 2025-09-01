import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Package, Plus, Minus } from 'lucide-react';
import { getInventoryLevels, updateInventory } from '@/lib/api';
import { products } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

export function InventoryManager() {
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const loadInventory = useCallback(async () => {
    try {
      const data = await getInventoryLevels();
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleUpdateStock = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Stock quantity cannot be negative',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(prev => ({ ...prev, [productId]: true }));

    try {
      await updateInventory(productId, newQuantity);
      setInventory(prev => ({ ...prev, [productId]: newQuantity }));
      
      toast({
        title: 'Success',
        description: 'Inventory updated successfully',
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive',
      });
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'out-of-stock', color: 'destructive', text: 'Out of Stock' };
    if (quantity <= 5) return { status: 'low', color: 'destructive', text: 'Low Stock' };
    if (quantity <= 15) return { status: 'medium', color: 'secondary', text: 'Medium Stock' };
    return { status: 'good', color: 'default', text: 'In Stock' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Inventory Management</h2>
        <p className="text-muted-foreground">
          Monitor and update product stock levels
        </p>
      </div>

      <div className="grid gap-6">
        {products.map((product) => {
          const currentStock = inventory[product.id] || 0;
          const stockStatus = getStockStatus(currentStock);
          const isUpdating = updating[product.id];

          return (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <Badge variant={stockStatus.color as "default" | "secondary" | "destructive"}>
                    {stockStatus.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Stock</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">{currentStock}</div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStock(product.id, currentStock + 1)}
                          disabled={isUpdating}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStock(product.id, Math.max(0, currentStock - 1))}
                          disabled={isUpdating}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Quick Update</h4>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="New quantity"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            const newQuantity = parseInt(input.value);
                            if (!isNaN(newQuantity)) {
                              handleUpdateStock(product.id, newQuantity);
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="New quantity"]`) as HTMLInputElement;
                          const newQuantity = parseInt(input.value);
                          if (!isNaN(newQuantity)) {
                            handleUpdateStock(product.id, newQuantity);
                            input.value = '';
                          }
                        }}
                        disabled={isUpdating}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>

                {stockStatus.status === 'out-of-stock' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">This product is out of stock</span>
                    </div>
                  </div>
                )}

                {stockStatus.status === 'low' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Low stock alert - consider restocking</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => (inventory[p.id] || 0) > 15).length}
              </div>
              <p className="text-sm text-muted-foreground">Well Stocked</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter(p => {
                  const stock = inventory[p.id] || 0;
                  return stock > 0 && stock <= 15;
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => (inventory[p.id] || 0) === 0).length}
              </div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 