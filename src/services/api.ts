import { Product, Order, CartItem } from "@/types/Product";
import { getToken } from './auth';

// Base URLs for the APIs
const DJANGO_API_BASE_URL = 'https://shopper-hub-9avf.onrender.com'; // Django backend URL for auth and orders
const FAKESTORE_API_BASE_URL = 'https://fakestoreapi.com'; // FakeStore API for products

// API endpoints
const ENDPOINTS = {
  // FakeStore API endpoints for products
  products: '/products',
  product: '/products/:id',
  categories: '/products/categories',
  productsByCategory: '/products/category/:category',
  
  // Django API endpoints for auth and orders
  orders: '/api/orders/',
  order: '/api/orders/:id/',
  payment: '/api/payment/',
  transactions: '/api/transactions/'
};

// Wishlist API endpoints
const WISHLIST_ENDPOINTS = {
  wishlist: '/api/wishlist/',
  wishlistItem: '/api/wishlist/:id/'
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Token ${token}` } : {};
};

// Format data from Django-like format (when you replace the API)
const formatFromDjango = (data: any): any => {
  return data;
};

// Helper function to simulate API delays
const simulateNetworkDelay = async () => {
  const delay = Math.random() * 500 + 200; // Random delay between 200-700ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${FAKESTORE_API_BASE_URL}${ENDPOINTS.products}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${FAKESTORE_API_BASE_URL}${ENDPOINTS.product.replace(':id', id.toString())}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${FAKESTORE_API_BASE_URL}${ENDPOINTS.productsByCategory.replace(':category', category)}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching products by category: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error(`Failed to fetch products in category ${category}:`, error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${FAKESTORE_API_BASE_URL}${ENDPOINTS.categories}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

// Payment interface
export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  amount: number;
}

// Payment response interface
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Process a payment
export const processPayment = async (paymentDetails: PaymentDetails): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.payment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(paymentDetails)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Payment processing failed' };
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error('Payment processing error:', error);
    return { 
      success: false, 
      error: 'Payment processing error' 
    };
  }
};

// Mock storage for orders (simulating a Django backend)
let mockOrdersStorage: Order[] = [];

// Initialize mock orders from localStorage for persistence
const initMockOrders = () => {
  try {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      mockOrdersStorage = JSON.parse(storedOrders);
    }
  } catch (error) {
    console.error("Failed to initialize mock orders:", error);
  }
};

// Call initialization
initMockOrders();

// Helper to persist mock orders to localStorage (simulating database)
const persistMockOrders = () => {
  localStorage.setItem('orders', JSON.stringify(mockOrdersStorage));
};

// Get user orders
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.orders}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return formatFromDjango(data);
  } catch (error) {
    console.error("Failed to get orders:", error);
    return [];
  }
};

// Add new order
export const addOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.orders}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(order)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating order: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return formatFromDjango(data);
  } catch (error) {
    console.error("Failed to add order:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.order.replace(':id', id)}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return formatFromDjango(data);
  } catch (error) {
    console.error(`Failed to get order with id ${id}:`, error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.order.replace(':id', id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return formatFromDjango(data);
  } catch (error) {
    console.error(`Failed to update order status for id ${id}:`, error);
    return null;
  }
};

// Cancel order
export const cancelOrder = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.order.replace(':id', id)}/cancel/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    await simulateNetworkDelay(); // Simulate network delay
    return response.ok;
  } catch (error) {
    console.error(`Failed to cancel order with id ${id}:`, error);
    return false;
  }
};

// Get transactions
export const getTransactions = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${ENDPOINTS.transactions}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return formatFromDjango(data);
  } catch (error) {
    console.error("Failed to get transactions:", error);
    return [];
  }
};

// Get user's wishlist
export const getWishlist = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${WISHLIST_ENDPOINTS.wishlist}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching wishlist: ${response.statusText}`);
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error("Failed to get wishlist:", error);
    return [];
  }
};

// Add product to wishlist
export const addToWishlist = async (product: Product): Promise<Product> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${WISHLIST_ENDPOINTS.wishlist}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(product)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add to wishlist');
    }
    
    const data = await response.json();
    await simulateNetworkDelay(); // Simulate network delay
    return data;
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${WISHLIST_ENDPOINTS.wishlistItem.replace(':id', productId.toString())}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    await simulateNetworkDelay(); // Simulate network delay
    return response.ok;
  } catch (error) {
    console.error(`Failed to remove product ${productId} from wishlist:`, error);
    return false;
  }
};

// Clear entire wishlist
export const clearWishlist = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}${WISHLIST_ENDPOINTS.wishlist}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    await simulateNetworkDelay(); // Simulate network delay
    return response.ok;
  } catch (error) {
    console.error("Failed to clear wishlist:", error);
    return false;
  }
};
