import { Product, Sale, Audit } from "@shared/schema";

export class ExportService {
  
  // Export to CSV
  static exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        }).join(",")
      )
    ].join("\n");

    this.downloadFile(csvContent, filename, "text/csv");
  }

  // Export to PDF (using a simple approach)
  static async exportToPDF(data: any[], title: string, filename: string): Promise<void> {
    // For a real implementation, you'd use jsPDF or similar library
    // This is a simplified approach that creates a printable HTML version
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #2E7D32; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          ${this.generateTable(data)}
        </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private static generateTable(data: any[]): string {
    if (data.length === 0) return "<p>No data available</p>";

    const headers = Object.keys(data[0]);
    const headerRow = headers.map(header => `<th>${header}</th>`).join("");
    const dataRows = data.map(row => 
      `<tr>${headers.map(header => `<td>${row[header] || ""}</td>`).join("")}</tr>`
    ).join("");

    return `
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${dataRows}</tbody>
      </table>
    `;
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Export products
  static exportProducts(products: Product[], format: "csv" | "pdf"): void {
    const filename = `products_${new Date().toISOString().split("T")[0]}`;
    
    if (format === "csv") {
      this.exportToCSV(products, `${filename}.csv`);
    } else {
      this.exportToPDF(products, "Products Report", `${filename}.pdf`);
    }
  }

  // Export sales
  static exportSales(sales: Sale[], format: "csv" | "pdf"): void {
    const filename = `sales_${new Date().toISOString().split("T")[0]}`;
    
    if (format === "csv") {
      this.exportToCSV(sales, `${filename}.csv`);
    } else {
      this.exportToPDF(sales, "Sales Report", `${filename}.pdf`);
    }
  }

  // Export audits
  static exportAudits(audits: Audit[], format: "csv" | "pdf"): void {
    const filename = `audits_${new Date().toISOString().split("T")[0]}`;
    
    if (format === "csv") {
      this.exportToCSV(audits, `${filename}.csv`);
    } else {
      this.exportToPDF(audits, "Audits Report", `${filename}.pdf`);
    }
  }
}
