import { toast } from 'sonner';

// API URLs
const API_BASE_URL = 'http://localhost:8000'; // Update with your Django server URL
const AUTH_ENDPOINTS = {
  signup: '/api/auth/signup/',
  login: '/api/auth/login/',
  profile: '/api/auth/profile/',
};

export interface User {
  id: number;
  email: string;
  fullName: string;
  dateJoined?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Helper to handle API errors
const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error.message || 'An unexpected error occurred';
};

// Store token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Store user in localStorage
export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user from localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage');
    return null;
  }
};

// Remove user from localStorage
export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Register a new user
export const signup = async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.signup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Signup failed');
    }

    const data = await response.json();
    
    // Store token and user data
    setToken(data.token);
    setUser(data.user);
    
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    toast.error(`Signup failed: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

// Login a user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token and user data
    setToken(data.token);
    setUser(data.user);
    
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    toast.error(`Login failed: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

// Get user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.profile}`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return await response.json();
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(`Failed to get user profile: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

// Logout user
export const logout = (): void => {
  removeToken();
  removeUser();
};
