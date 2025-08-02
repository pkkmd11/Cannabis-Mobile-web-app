import { createContext, useContext } from "react";

export type Language = "en" | "my" | "th";

const translations = {
  en: {
    // App
    "app.title": "CannabisTrack",
    "app.subtitle": "Inventory & Sales",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.inventory": "Inventory",
    "nav.sales": "Sales",
    "nav.reports": "Reports",
    "nav.audits": "Audits",
    
    // Dashboard
    "dashboard.total_products": "Total Products",
    "dashboard.low_stock": "Low Stock",
    "dashboard.daily_sales": "Today's Sales",
    "dashboard.pending_audits": "Pending Audits",
    "dashboard.quick_actions": "Quick Actions",
    "dashboard.recent_activity": "Recent Activity",
    
    // Actions
    "actions.add_product": "Add Product",
    "actions.new_sale": "New Sale",
    "actions.scan_barcode": "Scan Code",
    "actions.audit": "Start Audit",
    
    // Inventory
    "inventory.title": "Inventory Management",
    "inventory.search_placeholder": "Search products, strains, batch numbers...",
    "inventory.add_product": "Add Product",
    "inventory.strain_name": "Strain Name",
    "inventory.batch_number": "Batch Number",
    "inventory.thc_level": "THC Level (%)",
    "inventory.cbd_level": "CBD Level (%)",
    "inventory.quantity": "Quantity (g)",
    "inventory.unit_price": "Unit Price",
    "inventory.expiry_date": "Expiry Date",
    "inventory.harvest_date": "Harvest Date",
    "inventory.storage_location": "Storage Location",
    "inventory.product_type": "Product Type",
    
    // Sales
    "sales.title": "Sales Tracking",
    "sales.new_sale": "New Sale",
    "sales.select_product": "Select Product",
    "sales.choose_product": "Choose a product...",
    "sales.quantity": "Quantity (g)",
    "sales.price_per_gram": "Price per gram",
    "sales.customer_info": "Customer Info (Optional)",
    "sales.complete_sale": "Complete Sale",
    "sales.recent_sales": "Recent Sales",
    
    // Reports
    "reports.title": "Reports & Analytics",
    "reports.export": "Export Reports",
    "reports.export_pdf": "Export PDF",
    "reports.export_csv": "Export CSV",
    "reports.sales_trend": "Sales Trend (Last 7 Days)",
    "reports.inventory_overview": "Inventory Overview",
    
    // Audits
    "audits.title": "Compliance Audits",
    "audits.start_new": "Start New Audit",
    "audits.audit_type": "Audit Type",
    "audits.monthly": "Monthly Inventory Count",
    "audits.spot_check": "Spot Check",
    "audits.compliance": "Compliance Review",
    "audits.auditor_name": "Auditor Name",
    "audits.begin_audit": "Begin Audit",
    "audits.history": "Audit History",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
  },
  my: {
    // App
    "app.title": "ကန်နဗစ်ခြေရာခံ",
    "app.subtitle": "စာရင်းနှင့် ရောင်းချမှု",
    
    // Navigation
    "nav.dashboard": "ထိန်းချုပ်ခန်း",
    "nav.inventory": "စာရင်း",
    "nav.sales": "ရောင်းချမှု",
    "nav.reports": "အစီရင်ခံစာများ",
    "nav.audits": "စိစစ်ချက်များ",
    
    // Dashboard
    "dashboard.total_products": "စုစုပေါင်းထုတ်ကုန်များ",
    "dashboard.low_stock": "စတော့နည်းပါး",
    "dashboard.daily_sales": "ယနေ့ရောင်းချမှု",
    "dashboard.pending_audits": "စောင့်ဆိုင်းနေသည့်စိစစ်မှုများ",
    "dashboard.quick_actions": "မြန်ဆန်သောလုပ်ဆောင်ချက်များ",
    "dashboard.recent_activity": "မကြာသေးမီကလုပ်ဆောင်ချက်များ",
    
    // Actions
    "actions.add_product": "ထုတ်ကုန်ထည့်ရန်",
    "actions.new_sale": "အသစ်ရောင်းရန်",
    "actions.scan_barcode": "ကုဒ်စကင်န်",
    "actions.audit": "စိစစ်မှုစတင်ရန်",
    
    // Common
    "common.save": "သိမ်းဆည်းရန်",
    "common.cancel": "ပယ်ဖျက်ရန်",
    "common.edit": "တည်းဖြတ်ရန်",
    "common.delete": "ဖျက်ရန်",
    "common.loading": "တင်နေသည်...",
    "common.error": "အမှား",
    "common.success": "အောင်မြင်",
  },
  th: {
    // App
    "app.title": "CannabisTrack",
    "app.subtitle": "คลังสินค้าและการขาย",
    
    // Navigation
    "nav.dashboard": "แดชบอร์ด",
    "nav.inventory": "คลังสินค้า",
    "nav.sales": "การขาย",
    "nav.reports": "รายงาน",
    "nav.audits": "การตรวจสอบ",
    
    // Dashboard
    "dashboard.total_products": "สินค้าทั้งหมด",
    "dashboard.low_stock": "สต็อกต่ำ",
    "dashboard.daily_sales": "ยอดขายวันนี้",
    "dashboard.pending_audits": "การตรวจสอบที่รอดำเนินการ",
    "dashboard.quick_actions": "การดำเนินการด่วน",
    "dashboard.recent_activity": "กิจกรรมล่าสุด",
    
    // Actions
    "actions.add_product": "เพิ่มสินค้า",
    "actions.new_sale": "การขายใหม่",
    "actions.scan_barcode": "สแกนรหัส",
    "actions.audit": "เริ่มตรวจสอบ",
    
    // Common
    "common.save": "บันทึก",
    "common.cancel": "ยกเลิก",
    "common.edit": "แก้ไข",
    "common.delete": "ลบ",
    "common.loading": "กำลังโหลด...",
    "common.error": "ข้อผิดพลาด",
    "common.success": "สำเร็จ",
  },
};

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || key;
}
