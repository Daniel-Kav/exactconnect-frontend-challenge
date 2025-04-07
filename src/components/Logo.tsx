
import React from 'react';
import { PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/dashboard" className={`flex items-center gap-3 ${className}`}>
      <PieChart className="h-7 w-7 text-brand-red" />
      <span className="font-bold text-xl text-brand-red">Exactconnect</span>
    </Link>
  );
};

export default Logo;
