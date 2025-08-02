import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, DollarSign, ClipboardCheck, Plus, ShoppingCart, QrCode, Clipboard } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import type { Product, Sale, Audit } from "@shared/schema";

export default function Dashboard() {
  const { t } = useI18n();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: audits = [] } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  const lowStockProducts = products.filter(p => p.quantity < 10);
  const pendingAudits = audits.filter(a => a.status === "pending");
  
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.saleDate);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });
  
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const recentActivities = [
    ...todaySales.slice(0, 3).map(sale => {
      const product = products.find(p => p.id === sale.productId);
      return {
        type: "sale",
        icon: ShoppingCart,
        description: `Sale: ${product?.strainName || "Unknown"} - ${sale.quantity}g`,
        time: new Date(sale.saleDate).toLocaleTimeString(),
        amount: `$${sale.totalAmount.toFixed(2)}`,
        color: "text-green-600",
        bg: "bg-green-100",
      };
    }),
  ].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("dashboard.total_products")}</p>
                <p className="text-2xl font-bold text-cannabis-primary">{products.length}</p>
              </div>
              <Package className="text-cannabis-light text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("dashboard.low_stock")}</p>
                <p className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("dashboard.daily_sales")}</p>
                <p className="text-2xl font-bold text-green-600">${todayTotal.toFixed(2)}</p>
              </div>
              <DollarSign className="text-green-600 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("dashboard.pending_audits")}</p>
                <p className="text-2xl font-bold text-red-500">{pendingAudits.length}</p>
              </div>
              <ClipboardCheck className="text-red-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("dashboard.quick_actions")}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/inventory">
              <Button className="w-full p-3 bg-cannabis-light text-white hover:bg-cannabis-primary transition-colors">
                <Plus className="mr-2" size={16} />
                {t("actions.add_product")}
              </Button>
            </Link>
            <Link href="/sales">
              <Button className="w-full p-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                <ShoppingCart className="mr-2" size={16} />
                {t("actions.new_sale")}
              </Button>
            </Link>
            <Button className="w-full p-3 bg-purple-500 text-white hover:bg-purple-600 transition-colors">
              <QrCode className="mr-2" size={16} />
              {t("actions.scan_barcode")}
            </Button>
            <Link href="/audits">
              <Button className="w-full p-3 bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                <Clipboard className="mr-2" size={16} />
                {t("actions.audit")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("dashboard.recent_activity")}</h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className={`w-8 h-8 ${activity.bg} rounded-full flex items-center justify-center`}>
                    <activity.icon className={`${activity.color} text-xs`} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <span className={`text-sm font-medium ${activity.color}`}>{activity.amount}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
