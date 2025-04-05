
// This is a simplified payment processing service that simulates payment processing
// When connecting to a real payment gateway like Stripe or PayPal,
// replace these functions with actual API calls

import { toast } from "sonner";
import { Order } from "@/types/Product";

// Simulated card validation and processing
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

// Simulate payment processing
export const processPayment = async (cardDetails: CardDetails, amount: number): Promise<PaymentResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Validate card details
  if (!validateCardNumber(cardDetails.cardNumber)) {
    return { success: false, error: "Invalid card number" };
  }
  
  if (!validateExpiryDate(cardDetails.expiryDate)) {
    return { success: false, error: "Invalid expiry date" };
  }
  
  if (!validateCVV(cardDetails.cvv)) {
    return { success: false, error: "Invalid CVV" };
  }
  
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
