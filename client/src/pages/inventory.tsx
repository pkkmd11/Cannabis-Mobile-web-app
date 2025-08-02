import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "@/components/inventory/product-card";
import { ProductForm } from "@/components/inventory/product-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { indexedDBService } from "@/lib/indexeddb";
import type { Product, InsertProduct } from "@shared/schema";

export default function Inventory() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    staleTime: 0,
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      try {
        const response = await apiRequest("POST", "/api/products", data);
        const product = await response.json();
        await indexedDBService.saveProduct(product);
        return product;
      } catch (error) {
        // If server fails, save to IndexedDB only
        const product: Product = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await indexedDBService.saveProduct(product);
        return product;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t("common.success"), description: "Product created successfully" });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProduct> }) => {
      try {
        const response = await apiRequest("PUT", `/api/products/${id}`, data);
        const product = await response.json();
        await indexedDBService.saveProduct(product);
        return product;
      } catch (error) {
        // If server fails, update IndexedDB only
        const existingProduct = products.find(p => p.id === id);
        if (existingProduct) {
          const updatedProduct = { ...existingProduct, ...data, updatedAt: new Date().toISOString() };
          await indexedDBService.saveProduct(updatedProduct);
          return updatedProduct;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t("common.success"), description: "Product updated successfully" });
      setEditingProduct(null);
      setShowForm(false);
    },
    onError: (error) => {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiRequest("DELETE", `/api/products/${id}`);
        await indexedDBService.deleteProduct(id);
      } catch (error) {
        // If server fails, delete from IndexedDB only
        await indexedDBService.deleteProduct(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t("common.success"), description: "Product deleted successfully" });
    },
    onError: (error) => {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    },
  });

  const filteredProducts = products.filter(product =>
    product.strainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (data: InsertProduct) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <div className="p-4 pb-20">
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createProductMutation.isPending || updateProductMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{t("inventory.title")}</h2>
        <Button
          size="sm"
          variant="outline"
          className="p-2"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder={t("inventory.search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-gray-500">{t("common.loading")}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Add Product FAB */}
      <Button
        className="fixed bottom-24 right-4 w-14 h-14 bg-cannabis-primary text-white rounded-full shadow-lg hover:bg-cannabis-dark transition-colors"
        onClick={() => setShowForm(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
