import React from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Product } from '@/types/Product';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface WishlistButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'icon' | 'sm' | 'default' | 'lg';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  variant = 'ghost',
  size = 'icon'
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const isProductInWishlist = product && product.id ? isInWishlist(product.id) : false;
  
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || !product) return;
    
    try {
      if (isProductInWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  
  const tooltipText = isProductInWishlist 
    ? 'Remove from Wishlist' 
    : 'Add to Wishlist';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleToggleWishlist}
            disabled={!isAuthenticated || isLoading}
            className={`${isProductInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            aria-label={tooltipText}
          >
            {isProductInWishlist ? (
              <Heart className="h-5 w-5 fill-current" />
            ) : (
              <Heart className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!isAuthenticated ? 'Log in to use wishlist' : tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WishlistButton;
