
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <ShoppingCart className="h-6 w-6 text-brand-red" />
      <span className="font-bold text-xl text-brand-red">ShopperHub</span>
    </Link>
  );
};

export default Logo;
