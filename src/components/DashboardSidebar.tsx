
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, BarChart, ListOrdered, LayoutDashboard, Settings } from "lucide-react";
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
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
        isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <ShoppingCart className="h-4 w-4" />,
      label: "Products",
      href: "/products",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      label: "Orders",
      href: "/orders",
    },
    {
      icon: <BarChart className="h-4 w-4" />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      href: "/settings",
    },
  ];
  
  return (
    <div className="hidden lg:flex h-screen w-64 flex-col bg-sidebar fixed inset-y-0 border-r border-sidebar-border">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Logo />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
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
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
