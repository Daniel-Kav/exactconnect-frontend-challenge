
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; 
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./Logo";
import DashboardSidebar from "./DashboardSidebar";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const MobileNav = () => (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Logo className="scale-110" />
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid gap-2 p-4">
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Dashboard</span>
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/products'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Products</span>
            Products
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Orders</span>
            Orders
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/transactions'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Transactions</span>
            Transactions
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/reports'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Reports</span>
            Reports
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Settings</span>
            Settings
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Cart</span>
            Cart
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }}>
            <span className="sr-only">Wishlist</span>
            Wishlist
          </Button>
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-pink flex items-center justify-center">
              <span className="text-md font-semibold text-brand-red">
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.fullName || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-6 border-b bg-background px-6 sm:px-8">
      <div className="lg:hidden">
        {isMobile ? (
          <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
              <MobileNav />
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
        )}
      </div>
      <div className="lg:hidden">
        <Logo className="scale-110" />
      </div>
      <div className="relative ml-auto flex-1 md:grow-0 md:w-96">
        <div className="flex items-center relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full bg-background pl-10 pr-4 h-12 rounded-lg text-base"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="relative h-12 w-12 rounded-lg"
          onClick={() => navigate('/cart')}
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
          <span className="sr-only">Shopping Cart</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
              <span className="sr-only">Open user menu</span>
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="py-2">
              <p className="text-sm font-semibold">{user?.fullName || "User"}</p>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                {user?.email || "user@example.com"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="py-2 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="py-2 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
