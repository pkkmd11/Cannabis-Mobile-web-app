import { Product, Sale, Audit } from "@shared/schema";

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private readonly dbName = "CannabisTrackDB";
  private readonly dbVersion = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create products store
        if (!db.objectStoreNames.contains("products")) {
          const productsStore = db.createObjectStore("products", { keyPath: "id" });
          productsStore.createIndex("strainName", "strainName", { unique: false });
          productsStore.createIndex("batchNumber", "batchNumber", { unique: false });
        }

        // Create sales store
        if (!db.objectStoreNames.contains("sales")) {
          const salesStore = db.createObjectStore("sales", { keyPath: "id" });
          salesStore.createIndex("productId", "productId", { unique: false });
          salesStore.createIndex("saleDate", "saleDate", { unique: false });
        }

        // Create audits store
        if (!db.objectStoreNames.contains("audits")) {
          const auditsStore = db.createObjectStore("audits", { keyPath: "id" });
          auditsStore.createIndex("auditType", "auditType", { unique: false });
          auditsStore.createIndex("status", "status", { unique: false });
        }
      };
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["products"], "readonly");
      const store = transaction.objectStore("products");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveProduct(product: Product): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["products"], "readwrite");
      const store = transaction.objectStore("products");
      const request = store.put(product);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["products"], "readwrite");
      const store = transaction.objectStore("products");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["sales"], "readonly");
      const store = transaction.objectStore("sales");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSale(sale: Sale): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["sales"], "readwrite");
      const store = transaction.objectStore("sales");
      const request = store.put(sale);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Audits
  async getAudits(): Promise<Audit[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["audits"], "readonly");
      const store = transaction.objectStore("audits");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAudit(audit: Audit): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["audits"], "readwrite");
      const store = transaction.objectStore("audits");
      const request = store.put(audit);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sync with server
  async syncWithServer(): Promise<void> {
    try {
      // Get all local data
      const [localProducts, localSales, localAudits] = await Promise.all([
        this.getProducts(),
        this.getSales(),
        this.getAudits(),
      ]);

      // Sync products
      for (const product of localProducts) {
        try {
          await fetch(`/api/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });
        } catch (error) {
          console.warn("Failed to sync product:", product.id);
        }
      }

      // Sync sales
      for (const sale of localSales) {
        try {
          await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          });
        } catch (error) {
          console.warn("Failed to sync sale:", sale.id);
        }
      }

      // Sync audits
      for (const audit of localAudits) {
        try {
          await fetch("/api/audits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(audit),
          });
        } catch (error) {
          console.warn("Failed to sync audit:", audit.id);
        }
      }
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }
}

export const indexedDBService = new IndexedDBService();
