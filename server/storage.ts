import { type Product, type InsertProduct, type Sale, type InsertSale, type Audit, type InsertAudit, type AppSettings, type InsertAppSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Sales
  getSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: string, sale: Partial<InsertSale>): Promise<Sale>;
  getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]>;
  
  // Audits
  getAudits(): Promise<Audit[]>;
  getAudit(id: string): Promise<Audit | undefined>;
  createAudit(audit: InsertAudit): Promise<Audit>;
  updateAudit(id: string, audit: Partial<Audit>): Promise<Audit>;
  
  // App Settings
  getAppSettings(): Promise<AppSettings>;
  updateAppSettings(settings: InsertAppSettings): Promise<AppSettings>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private sales: Map<string, Sale>;
  private audits: Map<string, Audit>;
  private appSettings: AppSettings;

  constructor() {
    this.products = new Map();
    this.sales = new Map();
    this.audits = new Map();
    this.appSettings = {
      id: "default",
      appName: "CannabisTrack",
      logoUrl: "",
      theme: "light",
      language: "en",
      updatedAt: new Date().toISOString(),
    };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const sale: Sale = { 
      ...insertSale, 
      id, 
      createdAt: now 
    };
    this.sales.set(id, sale);
    
    // Update product quantity
    const product = this.products.get(insertSale.productId);
    if (product) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity - insertSale.quantity,
        updatedAt: now,
      };
      this.products.set(insertSale.productId, updatedProduct);
    }
    
    return sale;
  }

  async updateSale(id: string, updateData: Partial<InsertSale>): Promise<Sale> {
    const existingSale = this.sales.get(id);
    if (!existingSale) {
      throw new Error("Sale not found");
    }
    
    // If quantity is being updated, adjust product quantity
    if (updateData.quantity !== undefined && updateData.quantity !== existingSale.quantity) {
      const product = this.products.get(existingSale.productId);
      if (product) {
        const quantityDiff = existingSale.quantity - updateData.quantity;
        const updatedProduct = {
          ...product,
          quantity: product.quantity + quantityDiff,
          updatedAt: new Date().toISOString(),
        };
        this.products.set(existingSale.productId, updatedProduct);
      }
    }
    
    const updatedSale: Sale = {
      ...existingSale,
      ...updateData,
    };
    
    this.sales.set(id, updatedSale);
    return updatedSale;
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    const sales = Array.from(this.sales.values());
    return sales.filter(sale => 
      sale.saleDate >= startDate && sale.saleDate <= endDate
    );
  }

  // Audits
  async getAudits(): Promise<Audit[]> {
    return Array.from(this.audits.values());
  }

  async getAudit(id: string): Promise<Audit | undefined> {
    return this.audits.get(id);
  }

  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const audit: Audit = { 
      ...insertAudit, 
      id, 
      status: "pending",
      createdAt: now 
    };
    this.audits.set(id, audit);
    return audit;
  }

  async updateAudit(id: string, updateData: Partial<Audit>): Promise<Audit> {
    const existingAudit = this.audits.get(id);
    if (!existingAudit) {
      throw new Error("Audit not found");
    }
    
    const updatedAudit: Audit = {
      ...existingAudit,
      ...updateData,
    };
    
    this.audits.set(id, updatedAudit);
    return updatedAudit;
  }

  // App Settings
  async getAppSettings(): Promise<AppSettings> {
    return this.appSettings;
  }

  async updateAppSettings(settings: InsertAppSettings): Promise<AppSettings> {
    this.appSettings = {
      ...this.appSettings,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    return this.appSettings;
  }
}

export const storage = new MemStorage();
