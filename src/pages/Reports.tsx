
import { useState, useEffect } from 'react';
import { getUserOrders } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Download, FileText, FilePdf, FileX2 } from 'lucide-react';
import { Order } from '@/types/Product';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { 
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';

const Reports = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeRange, setTimeRange] = useState('all');
  const [reportType, setReportType] = useState('sales');
  
  useEffect(() => {
    // Load orders from localStorage
    const userOrders = getUserOrders();
    setOrders(userOrders);
  }, []);
  
  // Filter orders based on time range
  const getFilteredOrders = () => {
    if (timeRange === 'all') {
      return orders;
    }
    
    const now = new Date();
    let cutoff = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case '6month':
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return orders.filter(order => new Date(order.date) >= cutoff);
  };
  
  // Generate report data
  const generateReportData = () => {
    const filteredOrders = getFilteredOrders();
    
    if (reportType === 'sales') {
      // Group by month and sum sales
      const salesByMonth: { [key: string]: number } = {};
      
      filteredOrders.forEach(order => {
        const date = new Date(order.date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (salesByMonth[monthYear]) {
          salesByMonth[monthYear] += order.total;
        } else {
          salesByMonth[monthYear] = order.total;
        }
      });
      
      return Object.entries(salesByMonth).map(([month, sales]) => ({
        month,
        sales,
      }));
    }
    
    if (reportType === 'products') {
      // Count product occurrences
      const productCounts: { [key: string]: number } = {};
      
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          if (productCounts[item.title]) {
            productCounts[item.title] += item.quantity;
          } else {
            productCounts[item.title] = item.quantity;
          }
        });
      });
      
      // Get top 5 products
      return Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));
    }
    
    if (reportType === 'categories') {
      // Group by category
      const categoryTotals: { [key: string]: number } = {};
      
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          if (categoryTotals[item.category]) {
            categoryTotals[item.category] += item.price * item.quantity;
          } else {
            categoryTotals[item.category] = item.price * item.quantity;
          }
        });
      });
      
      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      }));
    }
    
    return [];
  };
  
  const reportData = generateReportData();
  
  const handleDownloadReport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      if (reportType === 'sales') {
        csvContent += 'Month,Sales\n';
        reportData.forEach(data => {
          csvContent += `${data.month},${data.sales.toFixed(2)}\n`;
        });
      } else if (reportType === 'products') {
        csvContent += 'Product,Quantity\n';
        reportData.forEach(data => {
          csvContent += `"${data.name}",${data.value}\n`;
        });
      } else if (reportType === 'categories') {
        csvContent += 'Category,Sales\n';
        reportData.forEach(data => {
          csvContent += `"${data.name}",${data.value.toFixed(2)}\n`;
        });
      }
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV Report downloaded successfully');
    } else if (format === 'pdf') {
      // Create PDF document
      const pdf = new jsPDF();
      
      // Add title
      const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
      pdf.setFontSize(18);
      pdf.text(title, 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Add report data
      pdf.setFontSize(10);
      
      if (reportType === 'sales') {
        // Create sales report table
        const headers = ['Month', 'Sales ($)'];
        const rows = reportData.map(data => [data.month, data.sales.toFixed(2)]);
        
        // Calculate total sales
        const totalSales = reportData.reduce((sum, item) => sum + item.sales, 0);
        rows.push(['TOTAL', totalSales.toFixed(2)]);
        
        // Add table
        pdf.setFontSize(12);
        pdf.text('Sales Summary', 20, 40);
        pdf.setFontSize(10);
        
        let y = 50;
        pdf.text(headers[0], 20, y);
        pdf.text(headers[1], 80, y);
        y += 5;
        pdf.line(20, y, 120, y);
        y += 10;
        
        rows.forEach((row, i) => {
          const isTotal = i === rows.length - 1;
          if (isTotal) {
            y += 5;
            pdf.line(20, y - 7, 120, y - 7);
            pdf.setFont("helvetica", "bold");
          }
          
          pdf.text(row[0], 20, y);
          pdf.text(row[1], 80, y);
          
          if (isTotal) {
            pdf.setFont("helvetica", "normal");
          }
          
          y += 10;
        });
      } else if (reportType === 'products' || reportType === 'categories') {
        // Create products/categories report table
        const headers = [reportType === 'products' ? 'Product' : 'Category', reportType === 'products' ? 'Quantity' : 'Sales ($)'];
        const rows = reportData.map(data => [data.name, data.value.toString()]);
        
        // Calculate total
        const total = reportData.reduce((sum, item) => sum + item.value, 0);
        rows.push(['TOTAL', total.toFixed(2)]);
        
        // Add table
        pdf.setFontSize(12);
        pdf.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Summary`, 20, 40);
        pdf.setFontSize(10);
        
        let y = 50;
        pdf.text(headers[0], 20, y);
        pdf.text(headers[1], 120, y);
        y += 5;
        pdf.line(20, y, 180, y);
        y += 10;
        
        rows.forEach((row, i) => {
          const isTotal = i === rows.length - 1;
          if (isTotal) {
            y += 5;
            pdf.line(20, y - 7, 180, y - 7);
            pdf.setFont("helvetica", "bold");
          }
          
          // Truncate long product/category names
          const name = row[0].length > 30 ? row[0].substring(0, 27) + '...' : row[0];
          pdf.text(name, 20, y);
          pdf.text(row[1], 120, y);
          
          if (isTotal) {
            pdf.setFont("helvetica", "normal");
          }
          
          y += 10;
        });
      }
      
      // Add note about time range
      let timeRangeText = 'All time';
      switch (timeRange) {
        case 'week': timeRangeText = 'Last week'; break;
        case 'month': timeRangeText = 'Last month'; break;
        case '6month': timeRangeText = 'Last 6 months'; break;
        case 'year': timeRangeText = 'Last year'; break;
      }
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Time period: ${timeRangeText}`, 20, pdf.internal.pageSize.height - 20);
      
      // Save PDF file
      pdf.save(`${reportType}-report.pdf`);
      
      toast.success('PDF Report downloaded successfully');
    }
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#E94A4A'];
  
  const renderChart = () => {
    if (reportData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            No data available for the selected time range
          </p>
        </div>
      );
    }
    
    if (reportType === 'sales') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#E94A4A" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    if (reportType === 'products') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#E94A4A" name="Units Sold" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (reportType === 'categories') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={reportData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {reportData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and download sales reports
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Select the report type and time range to generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="w-full sm:w-1/3">
              <label 
                htmlFor="report-type" 
                className="text-sm font-medium block mb-2"
              >
                Report Type
              </label>
              <Select 
                value={reportType} 
                onValueChange={setReportType}
              >
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="products">Product Performance</SelectItem>
                  <SelectItem value="categories">Category Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/3">
              <label 
                htmlFor="time-range" 
                className="text-sm font-medium block mb-2"
              >
                Time Range
              </label>
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
              >
                <SelectTrigger id="time-range">
                  <SelectValue placeholder="Select Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="6month">Last 6 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/3 flex items-end">
              <Menubar className="border-none p-0 w-full">
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button 
                      className="w-full"
                      disabled={reportData.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem 
                      onClick={() => handleDownloadReport('csv')}
                      disabled={reportData.length === 0}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download as CSV
                    </MenubarItem>
                    <MenubarItem 
                      onClick={() => handleDownloadReport('pdf')}
                      disabled={reportData.length === 0}
                    >
                      <FilePdf className="h-4 w-4 mr-2" />
                      Download as PDF
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
          
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
