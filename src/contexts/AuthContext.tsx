import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import * as authService from '../services/auth';
import { User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Call the Django backend login endpoint
      const response = await authService.login(email, password);
      setUser(response.user);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Call the Django backend signup endpoint
      const response = await authService.signup(fullName, email, password);
      setUser(response.user);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed: ' + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logged out successfully');
  };
  
  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
