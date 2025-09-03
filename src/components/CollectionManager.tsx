import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Save,
  Trash2,
  Grid,
  List,
  RotateCcw
} from 'lucide-react';
import { Product } from '@/types/product';
import { WebsiteSection, CollectionMapping, ShopifyCollection } from '@/types/collection';
import { getAllProducts, getShopifyCollections } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Default website sections
const DEFAULT_SECTIONS: WebsiteSection[] = [
  {
    id: 'hero',
    name: 'hero',
    displayName: 'Hero Section',
    description: 'Main featured products on homepage',
    maxProducts: 4,
    type: 'hero'
  },
  {
    id: 'featured',
    name: 'featured',
    displayName: 'Featured Products',
    description: 'Featured products section',
    maxProducts: 8,
    type: 'featured'
  },
  {
    id: 'new-arrivals',
    name: 'new-arrivals',
    displayName: 'New Arrivals',
    description: 'Latest products',
    maxProducts: 12,
    type: 'new-arrivals'
  },
  {
    id: 'bestsellers',
    name: 'bestsellers',
    displayName: 'Best Sellers',
    description: 'Top selling products',
    maxProducts: 8,
    type: 'bestsellers'
  },
  {
    id: 'women-collection',
    name: 'women-collection',
    displayName: 'Women\'s Collection',
    description: 'Women\'s athletic wear',
    type: 'collection'
  },
  {
    id: 'men-collection',
    name: 'men-collection',
    displayName: 'Men\'s Collection',
    description: 'Men\'s athletic wear',
    type: 'collection'
  }
];

export function CollectionManager() {
  const [sections] = useState<WebsiteSection[]>(DEFAULT_SECTIONS);
  const [mappings, setMappings] = useState<CollectionMapping[]>([]);
  const [shopifyCollections, setShopifyCollections] = useState<ShopifyCollection[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSection, setSelectedSection] = useState<WebsiteSection | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [products, collections] = await Promise.all([
        getAllProducts(),
        getShopifyCollections()
      ]);
      
      setAllProducts(products);
      setShopifyCollections(collections);
      
      // Load saved mappings from localStorage
      const savedMappings = localStorage.getItem('collectionMappings');
      if (savedMappings) {
        setMappings(JSON.parse(savedMappings));
      } else {
        // Initialize with default mappings
        const defaultMappings = sections.map(section => ({
          id: `mapping-${section.id}`,
          sectionId: section.id,
          productIds: [],
          settings: {
            showTitle: true,
            showDescription: true,
            layout: 'grid' as const,
            productsPerRow: 4,
            sortBy: 'manual' as const,
          },
          isActive: true,
          priority: 1,
        }));
        setMappings(defaultMappings);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products and collections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMappings = () => {
    localStorage.setItem('collectionMappings', JSON.stringify(mappings));
    toast({
      title: 'Success',
      description: 'Collection mappings saved successfully',
    });
  };

  const getSectionMapping = (sectionId: string) => {
    return mappings.find(m => m.sectionId === sectionId);
  };

  const updateMapping = (sectionId: string, updates: Partial<CollectionMapping>) => {
    setMappings(prev => prev.map(mapping => 
      mapping.sectionId === sectionId 
        ? { ...mapping, ...updates }
        : mapping
    ));
  };

  const getAssignedProducts = (sectionId: string): Product[] => {
    const mapping = getSectionMapping(sectionId);
    if (!mapping) return [];
    
    return mapping.productIds
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  };

  const handleSectionConfig = (section: WebsiteSection) => {
    setSelectedSection(section);
    const mapping = getSectionMapping(section.id);
    setSelectedProducts(mapping?.productIds || []);
    setIsConfigOpen(true);
  };

  const handleProductSelection = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const saveProductSelection = () => {
    if (!selectedSection) return;
    
    updateMapping(selectedSection.id, {
      productIds: selectedProducts
    });
    
    setIsConfigOpen(false);
    toast({
      title: 'Success',
      description: `Products updated for ${selectedSection.displayName}`,
    });
  };

  const loadFromShopifyCollection = (collectionId: string) => {
    const collection = shopifyCollections.find(c => c.id === collectionId);
    if (collection && selectedSection) {
      const productIds = collection.products.map(p => p.id);
      setSelectedProducts(productIds);
      
      updateMapping(selectedSection.id, {
        shopifyCollectionId: collectionId,
        productIds: productIds
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Collection Manager</h3>
          <p className="text-sm text-muted-foreground">
            Manage which products appear in different sections of your website
          </p>
        </div>
        <Button onClick={saveMappings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-4">
        {sections.map(section => {
          const mapping = getSectionMapping(section.id);
          const assignedProducts = getAssignedProducts(section.id);
          
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {section.displayName}
                      {mapping?.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                      {section.maxProducts && ` (Max: ${section.maxProducts} products)`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSectionConfig(section)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Switch
                      checked={mapping?.isActive ?? true}
                      onCheckedChange={(checked) => updateMapping(section.id, { isActive: checked })}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Assigned Products: {assignedProducts.length}
                    {section.maxProducts && ` / ${section.maxProducts}`}
                  </span>
                  {mapping?.shopifyCollectionId && (
                    <Badge variant="outline" className="text-xs">
                      Synced with Shopify
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {assignedProducts.slice(0, 4).map(product => (
                    <div key={product.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-xs truncate">{product.name}</span>
                    </div>
                  ))}
                  {assignedProducts.length > 4 && (
                    <div className="flex items-center justify-center p-2 bg-muted rounded text-xs text-muted-foreground">
                      +{assignedProducts.length - 4} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Product Selection Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedSection?.displayName}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">Select Products</TabsTrigger>
              <TabsTrigger value="shopify">Shopify Collections</TabsTrigger>
              <TabsTrigger value="settings">Display Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedProducts.length} products
                  {selectedSection?.maxProducts && ` (Max: ${selectedSection.maxProducts})`}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {allProducts.map(product => (
                  <div key={product.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleProductSelection(product.id, !!checked)}
                      disabled={
                        selectedSection?.maxProducts &&
                        selectedProducts.length >= selectedSection.maxProducts &&
                        !selectedProducts.includes(product.id)
                      }
                    />
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shopify" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Import products from your Shopify collections
              </p>
              
              <div className="grid gap-4">
                {shopifyCollections.map(collection => (
                  <Card key={collection.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{collection.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {collection.productsCount} products
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadFromShopifyCollection(collection.id)}
                        >
                          Import Products
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              {selectedSection && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Layout</Label>
                      <Select
                        value={getSectionMapping(selectedSection.id)?.settings.layout || 'grid'}
                        onValueChange={(value) => updateMapping(selectedSection.id, {
                          settings: {
                            ...getSectionMapping(selectedSection.id)?.settings!,
                            layout: value as 'grid' | 'carousel' | 'list'
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Products per Row</Label>
                      <Select
                        value={String(getSectionMapping(selectedSection.id)?.settings.productsPerRow || 4)}
                        onValueChange={(value) => updateMapping(selectedSection.id, {
                          settings: {
                            ...getSectionMapping(selectedSection.id)?.settings!,
                            productsPerRow: parseInt(value)
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Show Title</Label>
                    <Switch
                      checked={getSectionMapping(selectedSection.id)?.settings.showTitle ?? true}
                      onCheckedChange={(checked) => updateMapping(selectedSection.id, {
                        settings: {
                          ...getSectionMapping(selectedSection.id)?.settings!,
                          showTitle: checked
                        }
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Show Description</Label>
                    <Switch
                      checked={getSectionMapping(selectedSection.id)?.settings.showDescription ?? true}
                      onCheckedChange={(checked) => updateMapping(selectedSection.id, {
                        settings: {
                          ...getSectionMapping(selectedSection.id)?.settings!,
                          showDescription: checked
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProductSelection}>
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
