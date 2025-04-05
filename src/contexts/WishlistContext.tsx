import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types/Product';
import { useAuth } from './AuthContext';
import * as api from '../services/api';

interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await api.getWishlist();
      setWishlist(data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast.error('Failed to load wishlist');
      setWishlist([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your wishlist');
      return;
    }

    setIsLoading(true);
    try {
      await api.addToWishlist(product);
      setWishlist(prev => [...prev, product]);
      toast.success('Added to wishlist');
    } catch (error: any) {
      console.error('Failed to add to wishlist:', error);
      toast.error(error.message || 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const success = await api.removeFromWishlist(productId);
      if (success) {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        toast.success('Removed from wishlist');
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const success = await api.clearWishlist();
      if (success) {
        setWishlist([]);
        toast.success('Wishlist cleared');
      } else {
        throw new Error('Failed to clear wishlist');
      }
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some(item => item.id === productId);
  };

  const value = {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
