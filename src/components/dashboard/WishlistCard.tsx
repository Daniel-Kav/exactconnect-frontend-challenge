import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatCurrency } from '@/lib/utils';

const WishlistCard: React.FC = () => {
  const { wishlist = [] } = useWishlist();
  
  // Calculate total value of wishlist items
  const totalValue = wishlist?.reduce((sum, item) => sum + (item?.price || 0), 0);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          My Wishlist
        </CardTitle>
        <CardDescription>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {wishlist.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No items in your wishlist yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Show up to 3 most recent wishlist items */}
            {wishlist.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
            
            {wishlist.length > 3 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                +{wishlist.length - 3} more items
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="font-semibold">{formatCurrency(totalValue)}</p>
          </div>
          
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link to="/wishlist">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WishlistCard;
