// This payment processing service connects to our Django backend API
// while providing a fallback simulation for development

import { toast } from "sonner";
import { Order } from "@/types/Product";
import { getUserOrders } from "@/services/api";

// Card details for payment processing
export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

// Payment status response
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Transaction record interface
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  paymentMethod: string;
  orderId?: string;
}

// Validate card number using Luhn algorithm (basic validation)
const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-digit characters
  const normalizedNumber = cardNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (most card numbers are 13-19 digits)
  if (normalizedNumber.length < 13 || normalizedNumber.length > 19) {
    return false;
  }
  
  // Basic Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through the card number from right to left
  for (let i = normalizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(normalizedNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

// Validate expiry date (MM/YY format)
const validateExpiryDate = (expiryDate: string): boolean => {
  // Check format MM/YY
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }
  
  const [monthStr, yearStr] = expiryDate.split('/');
  const month = parseInt(monthStr);
  const year = parseInt('20' + yearStr); // Convert to full year
  
  // Check if month is valid
  if (month < 1 || month > 12) {
    return false;
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Check if the card is expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

// Validate CVV (3-4 digits)
const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Process payment through the backend API or fallback to simulation
export const processPayment = async (cardDetails: CardDetails, amount: number): Promise<PaymentResponse> => {
  // Basic client-side validation first
  if (!validateCardNumber(cardDetails.cardNumber)) {
    return { success: false, error: "Invalid card number" };
  }
  
  if (!validateExpiryDate(cardDetails.expiryDate)) {
    return { success: false, error: "Invalid expiry date" };
  }
  
  if (!validateCVV(cardDetails.cvv)) {
    return { success: false, error: "Invalid CVV" };
  }
  
  try {
    // Try to use the Django backend API
    const response = await fetch('/api/payment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber: cardDetails.cardNumber,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv,
        cardholderName: cardDetails.cardholderName,
        amount: amount
      })
    });
    
    if (!response.ok) {
      // If server responded with error, fallback to simulation
      console.warn('Backend payment API failed, falling back to simulation');
      return simulatePaymentProcessing(amount);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      transactionId: data.transactionId,
      error: data.error
    };
  } catch (error) {
    // If server unreachable, fallback to simulation
    console.warn('Backend payment API unreachable, falling back to simulation');
    return simulatePaymentProcessing(amount);
  }
};

// Fallback payment simulation
const simulatePaymentProcessing = async (amount: number): Promise<PaymentResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, we'll simulate a successful payment 90% of the time
  const isSuccessful = Math.random() < 0.9;
  
  if (isSuccessful) {
    // Generate a fake transaction ID
    const transactionId = 'TXN' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 10000);
    return { success: true, transactionId };
  } else {
    // Simulate a payment failure
    return { success: false, error: "Payment declined by issuer" };
  }
};

// Process a payment for an order
export const processOrderPayment = async (
  order: Omit<Order, 'id'>, 
  cardDetails: CardDetails
): Promise<PaymentResponse> => {
  try {
    // Attempt to process the payment
    const paymentResponse = await processPayment(cardDetails, order.total);
    
    if (paymentResponse.success) {
      // Payment successful - you could store the transaction ID with the order if desired
      toast.success("Payment processed successfully");
      return paymentResponse;
    } else {
      // Payment failed
      toast.error(`Payment failed: ${paymentResponse.error}`);
      return paymentResponse;
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    toast.error("Payment processing error. Please try again.");
    return { success: false, error: "Payment processing error" };
  }
};

// Get transaction history that matches user orders
export const getUserTransactions = async (): Promise<Transaction[]> => {
  try {
    // Try to fetch from backend
    const response = await fetch('/api/transactions/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // Fallback to simulated data
      console.warn('Backend transactions API failed, falling back to simulation');
      return simulateTransactionsFromOrders();
    }
    
    return await response.json();
  } catch (error) {
    // If server unreachable, return simulated data
    console.warn('Backend transactions API unreachable, returning simulated data');
    return simulateTransactionsFromOrders();
  }
};

// Simulate transactions based on user's orders
const simulateTransactionsFromOrders = async (): Promise<Transaction[]> => {
  try {
    // Get actual orders from the API
    const orders = await getUserOrders();
    
    if (!orders || orders.length === 0) {
      return generateRandomTransactions();
    }
    
    const mockTransactions: Transaction[] = orders.map(order => ({
      id: `txn-${order.id}`,
      date: new Date(order.date).toISOString(),
      amount: order.total,
      status: 'success', // Always set status to success
      paymentMethod: 'Credit Card',
      orderId: order.id
    }));
    
    // Sort by date, most recent first
    return mockTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to get orders for transaction simulation:", error);
    return generateRandomTransactions();
  }
};

// Generate random transactions as a last resort
const generateRandomTransactions = (): Transaction[] => {
  const mockTransactions: Transaction[] = [];
  
  // Generate some random transactions spanning last 30 days
  for (let i = 0; i < 5; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    mockTransactions.push({
      id: `txn-${Date.now()}-${i}`,
      date: date.toISOString(),
      amount: Math.floor(Math.random() * 30000) / 100, // Random amount between $0-$300
      status: 'success', // Always set status to success
      paymentMethod: 'Credit Card',
      orderId: `order-${Date.now()}-${i}`
    });
  }
  
  // Sort by date, most recent first
  return mockTransactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
