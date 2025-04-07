
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, BarChart, ListOrdered, LayoutDashboard, Settings, CreditCard } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, isActive = false }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-4 rounded-md px-4 py-3 text-base transition-all hover:bg-sidebar-accent",
        isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground"
      )}
    >
      <div className="flex items-center justify-center h-8 w-8">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Products",
      href: "/products",
    },
    {
      icon: <ListOrdered className="h-5 w-5" />,
      label: "Orders",
      href: "/orders",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Transactions",
      href: "/transactions",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];
  
  return (
    <div className="hidden lg:flex h-screen w-72 flex-col bg-sidebar fixed inset-y-0 border-r border-sidebar-border">
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <Logo className="scale-110" />
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid gap-2 items-start px-4 text-sm">
          {navItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-sidebar-border p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-pink flex items-center justify-center">
            <span className="text-md font-semibold text-brand-red">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.fullName || "User"}</span>
            <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
