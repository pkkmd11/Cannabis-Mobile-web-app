import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { SaleForm } from "@/components/sales/sale-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { indexedDBService } from "@/lib/indexeddb";
import type { Product, Sale, InsertSale, UpdateSale } from "@shared/schema";

export default function Sales() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

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

  const updateSaleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSale }) => {
      try {
        const response = await fetch(`/api/sales/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update sale");
        const sale = await response.json();
        await indexedDBService.saveSale(sale);
        return sale;
      } catch (error) {
        // If server fails, update IndexedDB only
        const existingSale = sales.find(s => s.id === id);
        if (existingSale) {
          const updatedSale = { ...existingSale, ...data };
          await indexedDBService.saveSale(updatedSale);
          return updatedSale;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingSale(null);
      toast({ title: t("common.success"), description: "Sale updated successfully" });
    },
    onError: (error) => {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    },
  });

  const recentSales = sales
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 10);

  const handleSaleSubmit = (data: InsertSale | UpdateSale) => {
    if (editingSale) {
      updateSaleMutation.mutate({ id: editingSale.id, data: data as UpdateSale });
    } else {
      createSaleMutation.mutate(data as InsertSale);
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleCancelEdit = () => {
    setEditingSale(null);
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t("sales.title")}</h2>
        {editingSale && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            {t("sales.edit_sale")}
          </Badge>
        )}
      </div>

      {/* New Sale Form */}
      <SaleForm
        products={products}
        sale={editingSale}
        onSubmit={handleSaleSubmit}
        onCancel={handleCancelEdit}
        isLoading={createSaleMutation.isPending || updateSaleMutation.isPending}
      />

      {/* Sales History */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 dark:text-gray-200">{t("sales.recent_sales")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales recorded yet</p>
            ) : (
              recentSales.map((sale) => {
                const product = products.find(p => p.id === sale.productId);
                return (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {product?.strainName || "Unknown Product"} - {sale.quantity}g
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(sale.saleDate).toLocaleDateString()} {new Date(sale.saleDate).toLocaleTimeString()}
                      </p>
                      {sale.customerInfo && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Customer: {sale.customerInfo}</p>
                      )}
                      {product?.supplier && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("sales.supplier")}: {product.supplier}
                        </p>
                      )}
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-green-600">${sale.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Batch #{sale.batchNumber}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSale(sale)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
