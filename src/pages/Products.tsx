
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOrder, setSortOrder] = useState<string>('');
  
  const { addToCart } = useCart();
  
  // Fetch products data
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  
  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (searchTerm === '' || product.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === '' || product.category === selectedCategory) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1])
    )
    .sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price-desc') {
        return b.price - a.price;
      } else if (sortOrder === 'name-asc') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };
  
  if (isLoadingProducts || isLoadingCategories) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Browse and manage your product catalog
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="sort" className="text-sm font-medium">
                    Sort By
                  </label>
                  <Select
                    value={sortOrder}
                    onValueChange={setSortOrder}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Default</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceRangeChange}
                  />
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  setSelectedCategory('');
                  setPriceRange([0, 1000]);
                  setSortOrder('');
                }}
              >
                Reset Filters
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <div className="aspect-square relative bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain w-full h-full p-4"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1 text-base">
                    {product.title}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2 h-10">{product.description}</p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between">
                <span className="font-medium">${product.price.toFixed(2)}</span>
                <Button size="sm" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
