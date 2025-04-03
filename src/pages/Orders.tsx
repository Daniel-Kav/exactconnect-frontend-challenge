
import { useState, useEffect } from 'react';
import { getUserOrders, addOrder } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Download, 
  ClipboardList, 
  ShoppingCart,
  Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/Product';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { items, totalPrice, clearCart } = useCart();
  
  useEffect(() => {
    // Load orders from localStorage
    const userOrders = getUserOrders();
    setOrders(userOrders);
  }, []);
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const handleCreateOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      const newOrder: Omit<Order, 'id'> = {
        date: new Date().toISOString(),
        status: 'pending',
        items: [...items],
        total: totalPrice,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '90210',
          country: 'USA',
        }
      };
      
      const order = addOrder(newOrder);
      setOrders(prev => [order, ...prev]);
      clearCart();
      toast.success('Order created successfully');
    } catch (error) {
      toast.error('Failed to create order');
      console.error(error);
    }
  };
  
  const handleDownloadReport = (order: Order) => {
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Order ID,Date,Status,Product,Price,Quantity,Subtotal\n';
    
    order.items.forEach(item => {
      csvContent += `${order.id},${new Date(order.date).toLocaleDateString()},${order.status},`;
      csvContent += `"${item.title}",${item.price},${item.quantity},${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // Add total row
    csvContent += `${order.id},${new Date(order.date).toLocaleDateString()},${order.status},`;
    csvContent += `"TOTAL",,,"$${order.total.toFixed(2)}"\n`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `order-${order.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report downloaded successfully');
  };
  
  const getStatusColor = (status: string) => {
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            View and manage your orders
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <Button variant="outline" onClick={handleCreateOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Place Order from Cart
          </Button>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Yet</CardTitle>
            <CardDescription>
              Your order history will appear here once you make a purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Start by adding products to your cart and creating an order
            </p>
            <Button className="mt-6">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              You have {orders.length} orders in total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Order Details #{selectedOrder?.id}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">
                                    Order Information
                                  </h4>
                                  <div className="text-sm">
                                    <p>
                                      <span className="font-medium">Date:</span>{' '}
                                      {new Date(selectedOrder.date).toLocaleDateString()}
                                    </p>
                                    <p>
                                      <span className="font-medium">Status:</span>{' '}
                                      <Badge 
                                        variant="outline" 
                                        className={getStatusColor(selectedOrder.status)}
                                      >
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                      </Badge>
                                    </p>
                                  </div>
                                </div>
                                
                                {selectedOrder.shippingAddress && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">
                                      Shipping Address
                                    </h4>
                                    <div className="text-sm">
                                      <p>{selectedOrder.shippingAddress.name}</p>
                                      <p>{selectedOrder.shippingAddress.street}</p>
                                      <p>
                                        {selectedOrder.shippingAddress.city},{' '}
                                        {selectedOrder.shippingAddress.state}{' '}
                                        {selectedOrder.shippingAddress.zip}
                                      </p>
                                      <p>{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Order Items
                                </h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product</TableHead>
                                      <TableHead className="text-right">Quantity</TableHead>
                                      <TableHead className="text-right">Price</TableHead>
                                      <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedOrder.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>
                                          <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                                              <img 
                                                src={item.image} 
                                                alt={item.title}
                                                className="object-contain h-10 w-10" 
                                              />
                                            </div>
                                            <span className="line-clamp-1">{item.title}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                
                                <div className="flex justify-end mt-4">
                                  <div className="w-48 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Subtotal:</span>
                                      <span>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Shipping:</span>
                                      <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                      <span>Total:</span>
                                      <span>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button 
                              variant="outline"
                              onClick={() => handleDownloadReport(selectedOrder!)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadReport(order)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
