import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types/product';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '/placeholder.svg',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    featured: false,
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        image: product.image,
        category: product.category,
        sizes: [...product.sizes],
        colors: [...product.colors],
        inStock: product.inStock,
        featured: product.featured || false,
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || formData.price <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const productData: Partial<Product> = {
      ...formData,
      originalPrice: formData.originalPrice > 0 ? formData.originalPrice : undefined,
    };

    onSave(productData);
  };

  const predefinedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const predefinedColors = [
    'Rose Pink', 'Black', 'White', 'Pearl White', 'Navy', 'Sage Green', 
    'Charcoal', 'Nude', 'Lavender', 'Mint', 'Grey', 'Blue', 'Red', 'Purple'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Flow High-Waist Leggings"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="e.g., Leggings, Sports Bras, Tops"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the product features, materials, and benefits..."
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price (optional)</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty if no discount. Used to show sale price.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Image</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden border-2 border-dashed border-neutral-300">
              {formData.image !== '/placeholder.svg' ? (
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Sizes</h3>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.sizes.map((size) => (
              <Badge key={size} variant="outline" className="flex items-center gap-1">
                {size}
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add size (e.g., XS, S, M)"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSize();
                }
              }}
            />
            <Button type="button" onClick={handleAddSize}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {predefinedSizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!formData.sizes.includes(size)) {
                    setFormData(prev => ({
                      ...prev,
                      sizes: [...prev.sizes, size]
                    }));
                  }
                }}
                className="text-xs"
                disabled={formData.sizes.includes(size)}
              >
                + {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Colors</h3>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color) => (
              <Badge key={color} variant="outline" className="flex items-center gap-1">
                {color}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add color (e.g., Rose Pink, Black)"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddColor();
                }
              }}
            />
            <Button type="button" onClick={handleAddColor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {predefinedColors.map((color) => (
              <Button
                key={color}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!formData.colors.includes(color)) {
                    setFormData(prev => ({
                      ...prev,
                      colors: [...prev.colors, color]
                    }));
                  }
                }}
                className="text-xs justify-start"
                disabled={formData.colors.includes(color)}
              >
                + {color}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>In Stock</Label>
              <p className="text-sm text-muted-foreground">
                Product is available for purchase
              </p>
            </div>
            <Switch
              checked={formData.inStock}
              onCheckedChange={(checked) => handleInputChange('inStock', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Product</Label>
              <p className="text-sm text-muted-foreground">
                Show on homepage and in featured sections
              </p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}