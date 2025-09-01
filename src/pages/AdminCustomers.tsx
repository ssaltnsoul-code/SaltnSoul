import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  MapPin,
  Calendar,
  Users,
  ShoppingBag,
  DollarSign,
  Star
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);

  // Mock customers data - in production, this would come from your API
  const [customers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      address: {
        city: 'New York',
        state: 'NY',
        country: 'US'
      },
      totalOrders: 8,
      totalSpent: 1247.50,
      joinDate: '2023-03-15T00:00:00Z',
      lastOrderDate: '2024-01-15T10:30:00Z',
      status: 'active',
      loyaltyTier: 'gold'
    },
    {
      id: 'CUST-002',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      address: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'US'
      },
      totalOrders: 3,
      totalSpent: 456.78,
      joinDate: '2023-08-22T00:00:00Z',
      lastOrderDate: '2024-01-14T15:45:00Z',
      status: 'active',
      loyaltyTier: 'silver'
    },
    {
      id: 'CUST-003',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      address: {
        city: 'Chicago',
        state: 'IL',
        country: 'US'
      },
      totalOrders: 12,
      totalSpent: 2134.90,
      joinDate: '2022-11-08T00:00:00Z',
      lastOrderDate: '2024-01-12T09:20:00Z',
      status: 'active',
      loyaltyTier: 'platinum'
    },
    {
      id: 'CUST-004',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      address: {
        city: 'Miami',
        state: 'FL',
        country: 'US'
      },
      totalOrders: 2,
      totalSpent: 198.50,
      joinDate: '2024-01-05T00:00:00Z',
      lastOrderDate: '2024-01-10T14:20:00Z',
      status: 'active',
      loyaltyTier: 'bronze'
    },
    {
      id: 'CUST-005',
      name: 'Jessica Wong',
      email: 'jessica.wong@email.com',
      address: {
        city: 'Seattle',
        state: 'WA',
        country: 'US'
      },
      totalOrders: 1,
      totalSpent: 89.00,
      joinDate: '2023-12-20T00:00:00Z',
      lastOrderDate: '2023-12-22T16:15:00Z',
      status: 'inactive',
      loyaltyTier: 'bronze'
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-100 text-amber-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    newThisMonth: customers.filter(c => 
      new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
  };

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, customer) => sum + customer.totalOrders, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer relationships and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.newThisMonth}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Loyalty Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {customer.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {customer.address.city}, {customer.address.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          ${customer.totalSpent.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getLoyaltyTierColor(customer.loyaltyTier)}`}>
                          <Star className="mr-1 h-3 w-3" />
                          <span className="capitalize">{customer.loyaltyTier}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(customer.status)}`}>
                          <span className="capitalize">{customer.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(customer.lastOrderDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              View Orders
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Detail Dialog */}
        <Dialog open={isCustomerDetailOpen} onOpenChange={setIsCustomerDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
            </DialogHeader>
            
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Contact Information</h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedCustomer.name}</p>
                      <p><strong>Email:</strong> {selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                      )}
                      <p><strong>Location:</strong> {selectedCustomer.address.city}, {selectedCustomer.address.state}, {selectedCustomer.address.country}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Account Details</h3>
                    <div className="space-y-2">
                      <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
                      <p><strong>Join Date:</strong> {formatDate(selectedCustomer.joinDate)}</p>
                      <p><strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedCustomer.status)}`}>
                          {selectedCustomer.status}
                        </Badge>
                      </p>
                      <p><strong>Loyalty Tier:</strong> 
                        <Badge className={`ml-2 ${getLoyaltyTierColor(selectedCustomer.loyaltyTier)}`}>
                          <Star className="mr-1 h-3 w-3" />
                          {selectedCustomer.loyaltyTier}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Purchase History */}
                <div>
                  <h3 className="font-semibold mb-4">Purchase History</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{selectedCustomer.totalOrders}</div>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Avg Order Value</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Last Order:</strong> {formatDate(selectedCustomer.lastOrderDate)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View Orders
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}