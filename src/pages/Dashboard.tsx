
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getUserOrders } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Heart 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Fetch products data
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  
  // Get orders from API through useEffect
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getUserOrders();
        setRecentOrders(orders.slice(0, 3)); // Now we properly await the Promise
      } catch (error) {
        console.error("Error fetching orders:", error);
        setRecentOrders([]);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Sample data for purchase history
  const purchaseHistoryData = [
    { month: 'Jan', amount: 120 },
    { month: 'Feb', amount: 230 },
    { month: 'Mar', amount: 450 },
    { month: 'Apr', amount: 180 },
    { month: 'May', amount: 320 },
    { month: 'Jun', amount: 280 },
  ];
  
  // Sample data for favorite categories
  const favoriteCategoriesData = [
    { name: "electronics", value: 40 },
    { name: "clothing", value: 30 },
    { name: "books", value: 20 },
    { name: "home", value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (isLoadingProducts) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'there'}!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your shopping activity and recent orders.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.56</div>
            <p className="text-xs text-muted-foreground">
              Lifetime purchases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Total orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Items saved for later
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cart</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Items in your cart
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={purchaseHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#E94A4A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Favorite Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={favoriteCategoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {favoriteCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">Order #{order.id}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items · ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/orders')}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">You haven't placed any orders yet</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/products')}
              >
                Start Shopping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
