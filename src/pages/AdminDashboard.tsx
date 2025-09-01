import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { getAllOrders, getInventoryLevels } from '@/lib/api';
import { products } from '@/data/products';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Array<{
    id: string;
    items: Array<{
      product: {
        id: string;
        name: string;
        price: number;
        image: string;
      };
      quantity: number;
      size: string;
      color: string;
    }>;
    customerInfo: {
      name: string;
      email: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
    total: number;
    status: string;
    createdAt: string;
    estimatedDelivery: string;
  }>>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, inventoryData] = await Promise.all([
          getAllOrders(),
          getInventoryLevels()
        ]);
        setOrders(ordersData);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate real stats from data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const uniqueCustomers = new Set(orders.map(order => order.customerInfo.email)).size;
  
  const stats = {
    revenue: {
      total: totalRevenue,
      change: 12.5, // Mock change for now
      period: 'vs last month'
    },
    orders: {
      total: orders.length,
      change: -2.1, // Mock change for now
      period: 'vs last month'
    },
    products: {
      total: products.length,
      change: 8.3, // Mock change for now
      period: 'vs last month'
    },
    customers: {
      total: uniqueCustomers,
      change: 15.2, // Mock change for now
      period: 'vs last month'
    }
  };

  const recentOrders = orders.slice(0, 4).map(order => ({
    id: order.id,
    customer: order.customerInfo.name,
    amount: order.total,
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString()
  }));

  const topProducts = products.map(product => {
    const stock = inventory[product.id] || 0;
    const sold = 50 - stock; // Mock sold calculation
    const revenue = sold * product.price;
    
    return {
      name: product.name,
      sold,
      revenue,
      stock
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-3 w-3" />;
      case 'shipped':
        return <AlertCircle className="h-3 w-3" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.total.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.revenue.change > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={stats.revenue.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(stats.revenue.change)}%
                </span>
                <span className="ml-1">{stats.revenue.period}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.orders.change > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={stats.orders.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(stats.orders.change)}%
                </span>
                <span className="ml-1">{stats.orders.period}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.products.change > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={stats.products.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(stats.products.change)}%
                </span>
                <span className="ml-1">{stats.products.period}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customers.total.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.customers.change > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={stats.customers.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(stats.customers.change)}%
                </span>
                <span className="ml-1">{stats.customers.period}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.customer}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.sold} sold</span>
                          <span>•</span>
                          <span>${product.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={product.stock < 10 ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {product.stock} in stock
                        </Badge>
                      </div>
                    </div>
                    {index < topProducts.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button className="h-20 flex flex-col gap-2">
                <Package className="h-6 w-6" />
                Add New Product
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                View Orders
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                Customer Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}