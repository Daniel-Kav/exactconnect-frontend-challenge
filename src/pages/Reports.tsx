
import { useState } from 'react';
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
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('spending');
  
  // Sample spending history data
  const spendingData = {
    week: [
      { day: 'Mon', amount: 45 },
      { day: 'Tue', amount: 0 },
      { day: 'Wed', amount: 123 },
      { day: 'Thu', amount: 0 },
      { day: 'Fri', amount: 75 },
      { day: 'Sat', amount: 25 },
      { day: 'Sun', amount: 0 },
    ],
    month: [
      { day: 'Week 1', amount: 243 },
      { day: 'Week 2', amount: 175 },
      { day: 'Week 3', amount: 98 },
      { day: 'Week 4', amount: 320 },
    ],
    year: [
      { month: 'Jan', amount: 320 },
      { month: 'Feb', amount: 450 },
      { month: 'Mar', amount: 280 },
      { month: 'Apr', amount: 390 },
      { month: 'May', amount: 420 },
      { month: 'Jun', amount: 560 },
      { month: 'Jul', amount: 310 },
      { month: 'Aug', amount: 480 },
      { month: 'Sep', amount: 620 },
      { month: 'Oct', amount: 350 },
      { month: 'Nov', amount: 490 },
      { month: 'Dec', amount: 780 },
    ]
  };
  
  // Sample category spending data
  const categoryData = [
    { name: "Electronics", value: 1250 },
    { name: "Clothing", value: 870 },
    { name: "Home & Kitchen", value: 540 },
    { name: "Books", value: 320 },
    { name: "Beauty", value: 210 },
  ];
  
  // Sample product frequency data
  const productData = [
    { name: "Smartphone", count: 3 },
    { name: "Laptop", count: 1 },
    { name: "Headphones", count: 2 },
    { name: "T-shirts", count: 5 },
    { name: "Cookware Set", count: 1 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const getCurrentData = () => {
    if (activeTab === 'spending') {
      return spendingData[timeRange];
    } else if (activeTab === 'categories') {
      return categoryData;
    } else {
      return productData;
    }
  };
  
  const currentData = getCurrentData();
  
  const handleDownloadReport = () => {
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (activeTab === 'spending') {
      const timeKey = timeRange === 'year' ? 'month' : 'day';
      csvContent += `${timeKey},Amount\n`;
      currentData.forEach(item => {
        csvContent += `${item[timeKey]},${item.amount}\n`;
      });
    } else if (activeTab === 'categories') {
      csvContent += 'Category,Amount\n';
      currentData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else {
      csvContent += 'Product,Purchase Count\n';
      currentData.forEach(item => {
        csvContent += `${item.name},${item.count}\n`;
      });
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeTab}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report downloaded successfully');
  };
  
  const renderChart = () => {
    if (activeTab === 'spending') {
      const dataKey = timeRange === 'year' ? 'month' : 'day';
      
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#E94A4A" 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (activeTab === 'categories') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {currentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Purchase Count']} />
            <Bar dataKey="count" fill="#E94A4A" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Shopping Reports</h2>
        <p className="text-muted-foreground">
          Track your shopping patterns and history
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shopping Analytics</CardTitle>
          <CardDescription>
            Gain insights into your shopping habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="spending"
            className="space-y-6"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="spending" className="flex items-center gap-2">
                  <LineChartIcon className="h-4 w-4" />
                  Spending History
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Products
                </TabsTrigger>
              </TabsList>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
            
            <TabsContent value="spending" className="space-y-4">
              <div className="flex justify-end items-center">
                <div className="w-48">
                  <Select
                    value={timeRange}
                    onValueChange={setTimeRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                      <SelectItem value="year">Last 12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {renderChart()}
              
              <div className="mt-4">
                <h4 className="font-medium">Key Insights</h4>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Your highest spending was in {timeRange === 'year' ? 'December' : timeRange === 'month' ? 'Week 4' : 'Wednesday'}</li>
                  <li>You spent 15% more than your usual average this {timeRange}</li>
                  <li>Most purchases were made on weekends</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="categories">
              {renderChart()}
              
              <div className="mt-4">
                <h4 className="font-medium">Category Insights</h4>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Electronics is your top spending category</li>
                  <li>You spend 30% more on Clothing than the average user</li>
                  <li>Your Home & Kitchen purchases have increased by 15% recently</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              {renderChart()}
              
              <div className="mt-4">
                <h4 className="font-medium">Product Insights</h4>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>You've purchased T-shirts most frequently</li>
                  <li>Your technology purchases are typically high-value items</li>
                  <li>You tend to repurchase headphones every 6 months</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
