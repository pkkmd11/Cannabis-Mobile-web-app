import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useI18n();

  const getStockStatus = () => {
    if (product.quantity <= 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (product.quantity < 10) return { label: "Low Stock", variant: "destructive" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus();
  const isExpired = new Date(product.expiryDate) < new Date();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{product.strainName}</h3>
          <Badge variant={stockStatus.variant}>
            {stockStatus.label}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div>Batch: {product.batchNumber}</div>
          <div>THC: {product.thcLevel}%</div>
          <div>CBD: {product.cbdLevel}%</div>
          <div>Quantity: {product.quantity}g</div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
            Expires: {new Date(product.expiryDate).toLocaleDateString()}
          </span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-3 w-3 mr-1" />
              {t("common.edit")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {t("common.delete")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
