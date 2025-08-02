import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertSaleSchema, insertAuditSchema, updateSaleSchema, insertAppSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid product data", error: error.message });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      res.json(product);
    } catch (error: any) {
      if (error.message === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(400).json({ message: "Invalid product data", error: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Sales
  app.get("/api/sales", async (req, res) => {
    try {
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  app.get("/api/sales/:id", async (req, res) => {
    try {
      const sale = await storage.getSale(req.params.id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json(sale);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch sale" });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(validatedData);
      res.status(201).json(sale);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid sale data", error: error.message });
    }
  });

  app.patch("/api/sales/:id", async (req, res) => {
    try {
      const validatedData = updateSaleSchema.parse(req.body);
      const sale = await storage.updateSale(req.params.id, validatedData);
      res.json(sale);
    } catch (error: any) {
      if (error.message === "Sale not found") {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.status(400).json({ message: "Invalid sale data", error: error.message });
    }
  });

  app.get("/api/sales/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      const sales = await storage.getSalesByDateRange(startDate as string, endDate as string);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  // Audits
  app.get("/api/audits", async (req, res) => {
    try {
      const audits = await storage.getAudits();
      res.json(audits);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch audits" });
    }
  });

  app.post("/api/audits", async (req, res) => {
    try {
      const validatedData = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(validatedData);
      res.status(201).json(audit);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid audit data", error: error.message });
    }
  });

  app.put("/api/audits/:id", async (req, res) => {
    try {
      const audit = await storage.updateAudit(req.params.id, req.body);
      res.json(audit);
    } catch (error: any) {
      if (error.message === "Audit not found") {
        return res.status(404).json({ message: "Audit not found" });
      }
      res.status(400).json({ message: "Invalid audit data", error: error.message });
    }
  });

  // App Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAppSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertAppSettingsSchema.parse(req.body);
      const settings = await storage.updateAppSettings(validatedData);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid settings data", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
