
import { Product, Order, CartItem } from "@/types/Product";

// Base URL for the API - Change this to your Django backend when ready
const API_BASE_URL = 'https://fakestoreapi.com'; // Will be replaced with Django backend URL

// Django API endpoints (currently mocked)
const DJANGO_API = {
  products: '/api/products/',
  product: '/api/products/:id/',
  categories: '/api/categories/',
  productsByCategory: '/api/products/category/:category/',
  orders: '/api/orders/',
  order: '/api/orders/:id/'
};

// Helper function to simulate API delays
const simulateNetworkDelay = async () => {
  const delay = Math.random() * 500 + 200; // Random delay between 200-700ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Format data from Django-like format (when you replace the API)
const formatFromDjango = (data: any): any => {
  // This function can be updated to transform Django API responses to match your frontend models
  return data;
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.products}`);
    
    const response = await fetch(`${API_BASE_URL}/products`);
    await simulateNetworkDelay(); // Simulate network delay
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    
    const data = await response.json();
    return formatFromDjango(data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.product.replace(':id', id.toString())}`);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    await simulateNetworkDelay(); // Simulate network delay
    
    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }
    
    const data = await response.json();
    return formatFromDjango(data);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.productsByCategory.replace(':category', category)}`);
    
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    await simulateNetworkDelay(); // Simulate network delay
    
    if (!response.ok) {
      throw new Error(`Error fetching products by category: ${response.statusText}`);
    }
    
    const data = await response.json();
    return formatFromDjango(data);
  } catch (error) {
    console.error(`Failed to fetch products in category ${category}:`, error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.categories}`);
    
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    await simulateNetworkDelay(); // Simulate network delay
    
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    return formatFromDjango(data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
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
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.orders}`);
    // return await response.json();
    
    await simulateNetworkDelay(); // Simulate API call delay
    return [...mockOrdersStorage]; // Return a copy to prevent accidental mutation
  } catch (error) {
    console.error("Failed to get orders:", error);
    return [];
  }
};

// Add new order
export const addOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.orders}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(order)
    // });
    // return await response.json();
    
    await simulateNetworkDelay(); // Simulate API call delay
    
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
    };
    
    mockOrdersStorage.push(newOrder);
    persistMockOrders();
    
    return newOrder;
  } catch (error) {
    console.error("Failed to add order:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.order.replace(':id', id)}`);
    // if (!response.ok) return null;
    // return await response.json();
    
    await simulateNetworkDelay(); // Simulate API call delay
    return mockOrdersStorage.find(order => order.id === id) || null;
  } catch (error) {
    console.error(`Failed to get order with id ${id}:`, error);
    return null;
  }
};

// Update order status - New function to simulate Django API
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.order.replace(':id', id)}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // });
    // if (!response.ok) return null;
    // return await response.json();
    
    await simulateNetworkDelay(); // Simulate API call delay
    
    const orderIndex = mockOrdersStorage.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;
    
    mockOrdersStorage[orderIndex] = {
      ...mockOrdersStorage[orderIndex],
      status
    };
    
    persistMockOrders();
    return mockOrdersStorage[orderIndex];
  } catch (error) {
    console.error(`Failed to update order status for id ${id}:`, error);
    return null;
  }
};

// Cancel order - Another example function
export const cancelOrder = async (id: string): Promise<boolean> => {
  try {
    // When switching to Django, replace with:
    // const response = await fetch(`${YOUR_DJANGO_URL}${DJANGO_API.order.replace(':id', id)}/cancel/`, {
    //   method: 'POST'
    // });
    // return response.ok;
    
    await simulateNetworkDelay(); // Simulate API call delay
    
    const result = await updateOrderStatus(id, 'cancelled');
    return !!result;
  } catch (error) {
    console.error(`Failed to cancel order with id ${id}:`, error);
    return false;
  }
};
