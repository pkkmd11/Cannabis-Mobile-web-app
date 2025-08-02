import { Link, useLocation } from "wouter";
import { Home, Package, ShoppingCart, BarChart3, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { path: "/", icon: Home, key: "nav.dashboard" },
  { path: "/inventory", icon: Package, key: "nav.inventory" },
  { path: "/sales", icon: ShoppingCart, key: "nav.sales" },
  { path: "/reports", icon: BarChart3, key: "nav.reports" },
  { path: "/audits", icon: ClipboardCheck, key: "nav.audits" },
];

export function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, key }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button
                className={cn(
                  "flex flex-col items-center py-2 px-3 transition-colors",
                  isActive
                    ? "text-cannabis-primary"
                    : "text-gray-500 hover:text-cannabis-primary"
                )}
              >
                <Icon className="text-lg mb-1" size={20} />
                <span className="text-xs">{t(key)}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
