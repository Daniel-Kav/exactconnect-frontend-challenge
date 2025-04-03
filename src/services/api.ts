
import { Product, Order } from "@/types/Product";

// Base URL for the Fake Store API
const API_BASE_URL = 'https://fakestoreapi.com';

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error(`Error fetching products by category: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch products in category ${category}:`, error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

// Mock functions for order management (since the Fake Store API doesn't support orders)
// These functions use localStorage for persistence

// Get user orders
export const getUserOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Failed to get orders:", error);
    return [];
  }
};

// Add new order
export const addOrder = (order: Omit<Order, 'id'>): Order => {
  try {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
    };
    
    const orders = getUserOrders();
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return newOrder;
  } catch (error) {
    console.error("Failed to add order:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = (id: string): Order | null => {
  try {
    const orders = getUserOrders();
    return orders.find(order => order.id === id) || null;
  } catch (error) {
    console.error(`Failed to get order with id ${id}:`, error);
    return null;
  }
};
