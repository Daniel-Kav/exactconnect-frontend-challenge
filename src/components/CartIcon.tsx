
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CartIcon: React.FC = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => navigate('/cart')}
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartIcon;
