import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/Product';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { formatCurrency } from '@/lib/utils';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative pt-[100%] bg-gray-100">
          <img 
            src={product.image} 
            alt={product.title}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
          <div className="absolute top-2 right-2">
            <WishlistButton product={product} />
          </div>
        </div>
        
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-md line-clamp-2 flex-grow">{product.title}</h3>
          </div>
          <p className="text-gray-500 text-sm mb-2">{product.category}</p>
          <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
        </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
