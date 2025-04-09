
import { useState, useEffect } from 'react';
import { getUserTransactions, Transaction } from '@/services/paymentService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Download,
  Calendar,
  Search,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getUserTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transaction history");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleDownloadReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction ID,Date,Amount,Status,Payment Method,Order ID\n';
    
    transactions.forEach(transaction => {
      csvContent += `${transaction.id},${new Date(transaction.date).toLocaleDateString()},`;
      csvContent += `$${transaction.amount.toFixed(2)},${transaction.status},`;
      csvContent += `${transaction.paymentMethod},${transaction.orderId || 'N/A'}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transaction_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Transaction report downloaded successfully');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTotalSpent = () => {
    return transactions
      .filter(t => t.status === 'success')
      .reduce((total, t) => total + t.amount, 0)
      .toFixed(2);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Transactions</h2>
          <p className="text-muted-foreground">Loading your transaction history...</p>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Transactions</h2>
          <p className="text-muted-foreground">
            View and track your payment history
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>No Transactions Yet</CardTitle>
            <CardDescription>
              Your payment history will appear here once you make a purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Start by adding products to your cart and completing a purchase
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
              <Button variant="outline" onClick={() => navigate('/cart')}>
                View Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Transactions</h2>
          <p className="text-muted-foreground">
            View and track your payment history
          </p>
        </div>
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spent
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalSpent()}</div>
            <p className="text-xs text-muted-foreground">
              Across all successful transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaction Count
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total payment attempts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((transactions.filter(t => t.status === 'success').length / transactions.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successful transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Transaction
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(transactions[0]?.date).toLocaleDateString() || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent payment
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            You have {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} in total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Order ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    {transaction.orderId ? (
                      <Button 
                        variant="link" 
                        className="px-0" 
                        onClick={() => navigate(`/orders?id=${transaction.orderId}`)}
                      >
                        {transaction.orderId}
                      </Button>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
