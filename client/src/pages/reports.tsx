import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ExportService } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";
import type { Product, Sale, Audit } from "@shared/schema";
import { useEffect, useRef } from "react";

export default function Reports() {
  const { t } = useI18n();
  const { toast } = useToast();
  const chartRef = useRef<HTMLCanvasElement>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: audits = [] } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  // Calculate stats
  const totalWeight = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockItems = products.filter(p => p.quantity < 10).length;
  const expiredItems = products.filter(p => new Date(p.expiryDate) < new Date()).length;

  // Get last 7 days of sales data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const salesByDay = last7Days.map(date => {
    const daySales = sales.filter(sale => sale.saleDate.startsWith(date));
    return daySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  });

  useEffect(() => {
    if (chartRef.current && window.Chart) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new window.Chart(ctx, {
          type: 'line',
          data: {
            labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
              label: 'Sales ($)',
              data: salesByDay,
              borderColor: 'hsl(142, 76%, 36%)',
              backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value;
                  }
                }
              }
            }
          }
        });
      }
    }
  }, [salesByDay, last7Days]);

  const handleExport = (type: "products" | "sales" | "audits", format: "csv" | "pdf") => {
    try {
      switch (type) {
        case "products":
          ExportService.exportProducts(products, format);
          break;
        case "sales":
          ExportService.exportSales(sales, format);
          break;
        case "audits":
          ExportService.exportAudits(audits, format);
          break;
      }
      toast({ title: t("common.success"), description: `${type} exported successfully` });
    } catch (error) {
      toast({ title: t("common.error"), description: "Export failed", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-xl font-semibold text-gray-800">{t("reports.title")}</h2>

      {/* Export Options */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("reports.export")}</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("products", "pdf")}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Products PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("products", "csv")}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4 text-green-600" />
                Products CSV
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("sales", "pdf")}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Sales PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("sales", "csv")}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4 text-green-600" />
                Sales CSV
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("audits", "pdf")}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Audits PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("audits", "csv")}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4 text-green-600" />
                Audits CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("reports.sales_trend")}</h3>
          <div className="h-48">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("reports.inventory_overview")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Products</span>
              <span className="font-semibold">{products.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Weight</span>
              <span className="font-semibold">{totalWeight.toFixed(1)} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Low Stock Items</span>
              <span className="font-semibold text-orange-600">{lowStockItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expired Items</span>
              <span className="font-semibold text-red-600">{expiredItems}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
