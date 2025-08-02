import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSaleSchema, type InsertSale, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

interface SaleFormProps {
  products: Product[];
  onSubmit: (data: InsertSale) => void;
  isLoading?: boolean;
}

export function SaleForm({ products, onSubmit, isLoading }: SaleFormProps) {
  const { t } = useI18n();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const form = useForm<InsertSale>({
    resolver: zodResolver(insertSaleSchema),
    defaultValues: {
      productId: "",
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      customerInfo: "",
      batchNumber: "",
      saleDate: new Date().toISOString(),
    },
  });

  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unitPrice");

  useEffect(() => {
    const total = quantity * unitPrice;
    form.setValue("totalAmount", total);
  }, [quantity, unitPrice, form]);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      form.setValue("productId", productId);
      form.setValue("unitPrice", product.unitPrice);
      form.setValue("batchNumber", product.batchNumber);
    }
  };

  const handleSubmit = (data: InsertSale) => {
    onSubmit(data);
    form.reset();
    setSelectedProduct(null);
  };

  const availableProducts = products.filter(p => p.quantity > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sales.new_sale")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("sales.select_product")}</FormLabel>
                  <Select onValueChange={handleProductSelect} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("sales.choose_product")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.strainName} - {product.quantity}g available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProduct && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Available: {selectedProduct.quantity}g | THC: {selectedProduct.thcLevel}% | CBD: {selectedProduct.cbdLevel}%
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sales.quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        max={selectedProduct?.quantity || 0}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sales.price_per_gram")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customerInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("sales.customer_info")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-3 bg-cannabis-light/10 rounded-lg">
              <p className="text-lg font-semibold text-cannabis-primary">
                Total: ${form.watch("totalAmount").toFixed(2)}
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cannabis-primary hover:bg-cannabis-dark"
              disabled={isLoading || !selectedProduct || quantity <= 0}
            >
              {isLoading ? t("common.loading") : t("sales.complete_sale")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
