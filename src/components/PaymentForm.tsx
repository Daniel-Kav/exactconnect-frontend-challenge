
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  Form
} from '@/components/ui/form';
import { CardDetails, PaymentResponse } from '@/services/paymentService';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  isSubmitting: boolean;
  onPaymentComplete: (response: PaymentResponse) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  isSubmitting, 
  onPaymentComplete, 
  onCancel 
}) => {
  const form = useForm<CardDetails>({
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    },
  });

  const handleSubmit = async (values: CardDetails) => {
    try {
      // This function would be handled by the parent component
      onPaymentComplete({
        success: true,
        transactionId: 'SIMULATED_TXN'
      });
    } catch (error) {
      toast.error("Payment processing error");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardholder Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="1234 5678 9012 3456" 
                    required 
                    maxLength={19}
                    onChange={(e) => {
                      // Format card number with spaces after every 4 digits
                      const value = e.target.value.replace(/\s/g, '');
                      const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                      field.onChange(formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="MM/YY" 
                      required 
                      maxLength={5}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="123" 
                      required 
                      maxLength={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-2">Payment Summary</h4>
          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>Pay ${amount.toFixed(2)}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
