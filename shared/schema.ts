import { z } from "zod";

// Product/Strain schema
export const productSchema = z.object({
  id: z.string(),
  strainName: z.string().min(1, "Strain name is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  thcLevel: z.number().min(0).max(100),
  cbdLevel: z.number().min(0).max(100),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  expiryDate: z.string(),
  harvestDate: z.string(),
  storageLocation: z.string(),
  productType: z.enum(["flower", "concentrate", "edible", "topical", "other"]),
  supplier: z.string().min(1, "Supplier is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Sale schema
export const saleSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().min(0.1),
  unitPrice: z.number().min(0),
  totalAmount: z.number().min(0),
  customerInfo: z.string().optional(),
  batchNumber: z.string(),
  saleDate: z.string(),
  createdAt: z.string(),
});

export const insertSaleSchema = saleSchema.omit({
  id: true,
  createdAt: true,
});

export const updateSaleSchema = insertSaleSchema.partial();

// Audit schema
export const auditSchema = z.object({
  id: z.string(),
  auditType: z.enum(["monthly", "spot", "compliance"]),
  auditorName: z.string().min(1, "Auditor name is required"),
  status: z.enum(["pending", "in-progress", "completed", "failed"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  discrepancies: z.array(z.object({
    productId: z.string(),
    expectedQuantity: z.number(),
    actualQuantity: z.number(),
    difference: z.number(),
  })).default([]),
  createdAt: z.string(),
});

export const insertAuditSchema = auditSchema.omit({
  id: true,
  createdAt: true,
  status: true,
});

// App settings schema
export const appSettingsSchema = z.object({
  id: z.string(),
  appName: z.string().min(1, "App name is required"),
  logoUrl: z.string().optional(),
  theme: z.enum(["light", "dark"]),
  language: z.enum(["en", "my", "th"]),
  updatedAt: z.string(),
});

export const insertAppSettingsSchema = appSettingsSchema.omit({
  id: true,
  updatedAt: true,
});

// Types
export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Sale = z.infer<typeof saleSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type UpdateSale = z.infer<typeof updateSaleSchema>;
export type Audit = z.infer<typeof auditSchema>;
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
