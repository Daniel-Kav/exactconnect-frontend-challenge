import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleAddToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product, 1);
      removeFromWishlist(productId);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        {wishlist.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => clearWishlist()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your wishlist while shopping</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <Card key={product.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative pt-[56.25%] bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              </div>
              
              <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="p-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeFromWishlist(product.id)}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
                
                <Button 
                  size="sm"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
