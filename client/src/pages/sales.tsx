import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { SaleForm } from "@/components/sales/sale-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { indexedDBService } from "@/lib/indexeddb";
import type { Product, Sale, InsertSale } from "@shared/schema";

export default function Sales() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const createSaleMutation = useMutation({
    mutationFn: async (data: InsertSale) => {
      try {
        const response = await apiRequest("POST", "/api/sales", data);
        const sale = await response.json();
        await indexedDBService.saveSale(sale);
        return sale;
      } catch (error) {
        // If server fails, save to IndexedDB only
        const sale: Sale = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        await indexedDBService.saveSale(sale);
        return sale;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t("common.success"), description: "Sale completed successfully" });
    },
    onError: (error) => {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    },
  });

  const recentSales = sales
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 10);

  const handleSaleSubmit = (data: InsertSale) => {
    createSaleMutation.mutate(data);
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-xl font-semibold text-gray-800">{t("sales.title")}</h2>

      {/* New Sale Form */}
      <SaleForm
        products={products}
        onSubmit={handleSaleSubmit}
        isLoading={createSaleMutation.isPending}
      />

      {/* Sales History */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("sales.recent_sales")}</h3>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales recorded yet</p>
            ) : (
              recentSales.map((sale) => {
                const product = products.find(p => p.id === sale.productId);
                return (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        {product?.strainName || "Unknown Product"} - {sale.quantity}g
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.saleDate).toLocaleDateString()} {new Date(sale.saleDate).toLocaleTimeString()}
                      </p>
                      {sale.customerInfo && (
                        <p className="text-sm text-gray-500">Customer: {sale.customerInfo}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${sale.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Batch #{sale.batchNumber}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
