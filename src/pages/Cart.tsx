
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { addOrder } from '@/services/api';
import { Order } from '@/types/Product';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Minus, Plus, ShoppingBasket, X, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import { processOrderPayment, PaymentResponse } from '@/services/paymentService';

interface ShippingFormValues {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Omit<Order, 'id'> | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<ShippingFormValues>({
    defaultValues: {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });
  
  const handleUpdateQuantity = (id: number, action: 'increase' | 'decrease') => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
    updateQuantity(id, newQuantity);
  };
  
  const handleCheckout = async (values: ShippingFormValues) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Create the order but don't submit it yet
    const newOrder: Omit<Order, 'id'> = {
      date: new Date().toISOString(),
      status: 'pending' as const,
      items: [...items],
      total: totalPrice,
      shippingAddress: values
    };
    
    // Store the pending order and show payment form
    setPendingOrder(newOrder);
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentResponse: PaymentResponse) => {
    if (!pendingOrder) return;
    
    if (paymentResponse.success) {
      setIsSubmitting(true);
      try {
        // Now using async API call to add the order after successful payment
        await addOrder(pendingOrder);
        
        clearCart();
        toast.success('Payment successful and order placed!');
        setIsCheckingOut(false);
        setShowPayment(false);
        navigate('/orders');
      } catch (error) {
        console.error('Failed to place order:', error);
        toast.error('Payment was successful but order placement failed. Please contact support.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error(`Payment failed: ${paymentResponse.error}`);
    }
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
    setPendingOrder(null);
    toast.info('Payment cancelled');
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Cart</h2>
          <p className="text-muted-foreground">
            View and manage your shopping cart
          </p>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <ShoppingBasket className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-center text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Cart</h2>
          <p className="text-muted-foreground">
            View and manage your shopping cart
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
          <Sheet open={isCheckingOut} onOpenChange={setIsCheckingOut}>
            <SheetTrigger asChild>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              {!showPayment ? (
                <>
                  <SheetHeader>
                    <SheetTitle>Checkout</SheetTitle>
                    <SheetDescription>
                      Complete your order by providing your shipping information.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Anytown" {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input placeholder="CA" {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="90210" {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="USA" {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">Order Summary</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal ({totalItems} items)</span>
                              <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>Free</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span>Total</span>
                              <span>${totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                          <SheetClose asChild>
                            <Button variant="outline" type="button" disabled={isSubmitting}>
                              Cancel
                            </Button>
                          </SheetClose>
                          <Button type="submit" disabled={isSubmitting}>
                            Continue to Payment
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </>
              ) : (
                <>
                  <SheetHeader>
                    <SheetTitle>Payment Information</SheetTitle>
                    <SheetDescription>
                      Please enter your payment details to complete your order.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6">
                    <PaymentForm
                      amount={totalPrice}
                      isSubmitting={isSubmitting}
                      onPaymentComplete={handlePaymentComplete}
                      onCancel={handleCancelPayment}
                    />
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
          <CardDescription>
            You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="object-contain h-12 w-12" 
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleUpdateQuantity(item.id, 'decrease')}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="h-8 px-3 flex items-center justify-center border-y">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleUpdateQuantity(item.id, 'increase')}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-lg flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Subtotal</div>
              <div className="text-2xl font-bold">${totalPrice.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">Shipping calculated at checkout</div>
            </div>
            <Button onClick={() => setIsCheckingOut(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Cart;
