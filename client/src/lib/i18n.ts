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
    "nav.settings": "Settings",
    
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
    "inventory.supplier": "Supplier",
    "inventory.product_types.flower": "Flower",
    "inventory.product_types.concentrate": "Concentrate",
    "inventory.product_types.edible": "Edible",
    "inventory.product_types.topical": "Topical",
    "inventory.product_types.other": "Other",
    
    // Sales
    "sales.title": "Sales Tracking",
    "sales.new_sale": "New Sale",
    "sales.edit_sale": "Edit Sale",
    "sales.select_product": "Select Product",
    "sales.choose_product": "Choose a product...",
    "sales.quantity": "Quantity (g)",
    "sales.price_per_gram": "Price per gram",
    "sales.customer_info": "Customer Info (Optional)",
    "sales.complete_sale": "Complete Sale",
    "sales.update_sale": "Update Sale",
    "sales.recent_sales": "Recent Sales",
    "sales.total": "Total",
    "sales.available": "Available",
    "sales.batch": "Batch",
    "sales.customer": "Customer",
    "sales.sale_date": "Sale Date",
    "sales.supplier": "Supplier",
    
    // Reports
    "reports.title": "Reports & Analytics",
    "reports.export": "Export Reports",
    "reports.export_pdf": "Export PDF",
    "reports.export_csv": "Export CSV",
    "reports.sales_trend": "Sales Trend (Last 7 Days)",
    "reports.inventory_overview": "Inventory Overview",
    "reports.total_products": "Total Products",
    "reports.total_weight": "Total Weight",
    "reports.low_stock_items": "Low Stock Items",
    "reports.expired_items": "Expired Items",
    
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
    "audits.status.pending": "Pending",
    "audits.status.in-progress": "In Progress",
    "audits.status.completed": "Completed",
    "audits.status.failed": "Failed",
    "audits.discrepancies": "discrepancies",
    "audits.start_date": "Start Date",
    "audits.notes": "Notes",
    
    // Settings
    "settings.title": "Settings",
    "settings.app_name": "App Name",
    "settings.theme": "Theme",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.language": "Language",
    "settings.logo": "App Logo",
    "settings.upload_logo": "Upload Logo",
    "settings.reset_logo": "Reset Logo",
    "settings.save_settings": "Save Settings",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.confirm": "Are you sure?",
    "common.yes": "Yes",
    "common.no": "No",
    "common.expires": "Expires",
    "common.batch": "Batch",
    "common.in_stock": "In Stock",
    "common.low_stock": "Low Stock",
    "common.out_of_stock": "Out of Stock",
    "common.no_data": "No data available",
    "common.search": "Search",
    "common.filter": "Filter",
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
    "nav.settings": "ဆက်တင်များ",
    
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
    
    // Inventory
    "inventory.title": "ကုန်စာရင်းစီမံခန့်ခွဲမှု",
    "inventory.search_placeholder": "ထုတ်ကုန်များ၊ မျိုးကွဲများ၊ အစုအဖွဲ့နံပါတ်များ ရှာရန်...",
    "inventory.add_product": "ထုတ်ကုန်ထည့်ရန်",
    "inventory.strain_name": "မျိုးကွဲအမည်",
    "inventory.batch_number": "အစုအဖွဲ့နံပါတ်",
    "inventory.thc_level": "THC အဆင့် (%)",
    "inventory.cbd_level": "CBD အဆင့် (%)",
    "inventory.quantity": "ပမာဏ (ဂရမ်)",
    "inventory.unit_price": "ယူနစ်စျေးနှုန်း",
    "inventory.expiry_date": "သက်တမ်းကုန်မည့်ရက်",
    "inventory.harvest_date": "ရိတ်သိမ်းမည့်ရက်",
    "inventory.storage_location": "သိမ်းဆည်းရာနေရာ",
    "inventory.product_type": "ထုတ်ကုန်အမျိုးအစား",
    "inventory.supplier": "ပေးစွမ်းသူ",
    "inventory.product_types.flower": "ပန်း",
    "inventory.product_types.concentrate": "သန့်စင်ထား",
    "inventory.product_types.edible": "စားနိုင်သော",
    "inventory.product_types.topical": "ပြင်ပအသုံးပြု",
    "inventory.product_types.other": "အခြား",
    
    // Sales
    "sales.title": "ရောင်းချမှုခြေရာခံခြင်း",
    "sales.new_sale": "အသစ်ရောင်းရန်",
    "sales.edit_sale": "ရောင်းချမှုတည်းဖြတ်ရန်",
    "sales.select_product": "ထုတ်ကုန်ရွေးချယ်ရန်",
    "sales.choose_product": "ထုတ်ကုန်တစ်ခုရွေးချယ်ပါ...",
    "sales.quantity": "ပမာဏ (ဂရမ်)",
    "sales.price_per_gram": "ဂရမ်တစ်ဂရမ်ပါစျေး",
    "sales.customer_info": "ဖောက်သည်အချက်အလက် (မဖြစ်မနေမလို)",
    "sales.complete_sale": "ရောင်းချမှုပြီးမြောက်ပါ",
    "sales.update_sale": "ရောင်းချမှုမွမ်းမံပါ",
    "sales.recent_sales": "မကြာသေးမီကရောင်းချမှုများ",
    "sales.total": "စုစုပေါင်း",
    "sales.available": "ရရှိနိုင်သော",
    "sales.batch": "အစုအဖွဲ့",
    "sales.customer": "ဖောက်သည်",
    "sales.sale_date": "ရောင်းချမှုရက်စွဲ",
    "sales.supplier": "ပေးစွမ်းသူ",
    
    // Reports
    "reports.title": "အစီရင်ခံစာများနှင့် ခွဲခြမ်းစိတ်ဖြာမှုများ",
    "reports.export": "အစီရင်ခံစာများထုတ်ယူရန်",
    "reports.export_pdf": "PDF ထုတ်ယူရန်",
    "reports.export_csv": "CSV ထုတ်ယူရန်",
    "reports.sales_trend": "ရောင်းချမှုလမ်းကြောင်း (ပြီးခဲ့သည့်ရက် ၇ ရက်)",
    "reports.inventory_overview": "ကုန်စာရင်းခြုံငုံသုံးသပ်ချက်",
    "reports.total_products": "စုစုပေါင်းထုတ်ကုန်များ",
    "reports.total_weight": "စုစုပေါင်းအလေးချိန်",
    "reports.low_stock_items": "စတော့နည်းပါးသောပစ္စည်းများ",
    "reports.expired_items": "သက်တမ်းကုန်ဆုံးသောပစ္စည်းများ",
    
    // Audits
    "audits.title": "လိုက်နာမှုစိစစ်ချက်များ",
    "audits.start_new": "အသစ်စိစစ်မှုစတင်ရန်",
    "audits.audit_type": "စိစစ်မှုအမျိုးအစား",
    "audits.monthly": "လစဉ်ကုန်စာရင်းရေတွက်ခြင်း",
    "audits.spot_check": "နေရာတိုက်စစ်ဆေးမှု",
    "audits.compliance": "လိုက်နာမှုပြန်လည်သုံးသပ်ခြင်း",
    "audits.auditor_name": "စိစစ်သူအမည်",
    "audits.begin_audit": "စိစစ်မှုစတင်ရန်",
    "audits.history": "စိစစ်မှုသမိုင်း",
    "audits.status.pending": "စောင့်ဆိုင်းနေသည်",
    "audits.status.in-progress": "လုပ်ဆောင်နေသည်",
    "audits.status.completed": "ပြီးမြောက်ပါပြီ",
    "audits.status.failed": "မအောင်မြင်ပါ",
    "audits.discrepancies": "ကွဲပြားမှုများ",
    "audits.start_date": "စတင်ရက်စွဲ",
    "audits.notes": "မှတ်စုများ",
    
    // Settings
    "settings.title": "ဆက်တင်များ",
    "settings.app_name": "အက်ပ်အမည်",
    "settings.theme": "အပြင်အဆင်",
    "settings.theme.light": "အလင်း",
    "settings.theme.dark": "အမှောင်",
    "settings.language": "ဘာသာစကား",
    "settings.logo": "အက်ပ်လိုဂို",
    "settings.upload_logo": "လိုဂိုတင်ရန်",
    "settings.reset_logo": "လိုဂိုပြန်လည်သတ်မှတ်ရန်",
    "settings.save_settings": "ဆက်တင်များသိမ်းဆည်းရန်",
    
    // Common
    "common.save": "သိမ်းဆည်းရန်",
    "common.cancel": "ပယ်ဖျက်ရန်",
    "common.edit": "တည်းဖြတ်ရန်",
    "common.delete": "ဖျက်ရန်",
    "common.loading": "တင်နေသည်...",
    "common.error": "အမှား",
    "common.success": "အောင်မြင်",
    "common.confirm": "သေချာပါသလား?",
    "common.yes": "ဟုတ်ပါ",
    "common.no": "မဟုတ်ပါ",
    "common.expires": "သက်တမ်းကုန်",
    "common.batch": "အစုအဖွဲ့",
    "common.in_stock": "စတော့တွင်ရှိ",
    "common.low_stock": "စတော့နည်းပါး",
    "common.out_of_stock": "စတော့ကုန်ဆုံး",
    "common.no_data": "ဒေတာမရှိပါ",
    "common.search": "ရှာရန်",
    "common.filter": "စစ်ထုတ်ရန်",
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
    "nav.settings": "การตั้งค่า",
    
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
    
    // Inventory
    "inventory.title": "การจัดการคลังสินค้า",
    "inventory.search_placeholder": "ค้นหาสินค้า, สายพันธุ์, หมายเลขแบทช์...",
    "inventory.add_product": "เพิ่มสินค้า",
    "inventory.strain_name": "ชื่อสายพันธุ์",
    "inventory.batch_number": "หมายเลขแบทช์",
    "inventory.thc_level": "ระดับ THC (%)",
    "inventory.cbd_level": "ระดับ CBD (%)",
    "inventory.quantity": "ปริมาณ (กรัม)",
    "inventory.unit_price": "ราคาต่อหน่วย",
    "inventory.expiry_date": "วันหมดอายุ",
    "inventory.harvest_date": "วันเก็บเกี่ยว",
    "inventory.storage_location": "สถานที่เก็บ",
    "inventory.product_type": "ประเภทสินค้า",
    "inventory.supplier": "ผู้จัดหา",
    "inventory.product_types.flower": "ดอกไม้",
    "inventory.product_types.concentrate": "สารสกัดข้น",
    "inventory.product_types.edible": "ของกิน",
    "inventory.product_types.topical": "ใช้ภายนอก",
    "inventory.product_types.other": "อื่นๆ",
    
    // Sales
    "sales.title": "ติดตามการขาย",
    "sales.new_sale": "การขายใหม่",
    "sales.edit_sale": "แก้ไขการขาย",
    "sales.select_product": "เลือกสินค้า",
    "sales.choose_product": "เลือกสินค้า...",
    "sales.quantity": "ปริมาณ (กรัม)",
    "sales.price_per_gram": "ราคาต่อกรัม",
    "sales.customer_info": "ข้อมูลลูกค้า (ไม่บังคับ)",
    "sales.complete_sale": "ทำการขาย",
    "sales.update_sale": "อัปเดตการขาย",
    "sales.recent_sales": "การขายล่าสุด",
    "sales.total": "รวม",
    "sales.available": "มีอยู่",
    "sales.batch": "แบทช์",
    "sales.customer": "ลูกค้า",
    "sales.sale_date": "วันที่ขาย",
    "sales.supplier": "ผู้จัดหา",
    
    // Reports
    "reports.title": "รายงานและการวิเคราะห์",
    "reports.export": "ส่งออกรายงาน",
    "reports.export_pdf": "ส่งออก PDF",
    "reports.export_csv": "ส่งออก CSV",
    "reports.sales_trend": "แนวโน้มการขาย (7 วันที่ผ่านมา)",
    "reports.inventory_overview": "ภาพรวมคลังสินค้า",
    "reports.total_products": "สินค้าทั้งหมด",
    "reports.total_weight": "น้ำหนักรวม",
    "reports.low_stock_items": "สินค้าสต็อกต่ำ",
    "reports.expired_items": "สินค้าหมดอายุ",
    
    // Audits
    "audits.title": "การตรวจสอบการปฏิบัติตาม",
    "audits.start_new": "เริ่มการตรวจสอบใหม่",
    "audits.audit_type": "ประเภทการตรวจสอบ",
    "audits.monthly": "การนับสินค้าประจำเดือน",
    "audits.spot_check": "การตรวจสอบจุด",
    "audits.compliance": "การทบทวนการปฏิบัติตาม",
    "audits.auditor_name": "ชื่อผู้ตรวจสอบ",
    "audits.begin_audit": "เริ่มการตรวจสอบ",
    "audits.history": "ประวัติการตรวจสอบ",
    "audits.status.pending": "รอดำเนินการ",
    "audits.status.in-progress": "กำลังดำเนินการ",
    "audits.status.completed": "เสร็จสิ้น",
    "audits.status.failed": "ล้มเหลว",
    "audits.discrepancies": "ความไม่สอดคล้อง",
    "audits.start_date": "วันที่เริ่ม",
    "audits.notes": "หมายเหตุ",
    
    // Settings
    "settings.title": "การตั้งค่า",
    "settings.app_name": "ชื่อแอป",
    "settings.theme": "ธีม",
    "settings.theme.light": "สว่าง",
    "settings.theme.dark": "มืด",
    "settings.language": "ภาษา",
    "settings.logo": "โลโก้แอป",
    "settings.upload_logo": "อัปโหลดโลโก้",
    "settings.reset_logo": "รีเซ็ตโลโก้",
    "settings.save_settings": "บันทึกการตั้งค่า",
    
    // Common
    "common.save": "บันทึก",
    "common.cancel": "ยกเลิก",
    "common.edit": "แก้ไข",
    "common.delete": "ลบ",
    "common.loading": "กำลังโหลด...",
    "common.error": "ข้อผิดพลาด",
    "common.success": "สำเร็จ",
    "common.confirm": "คุณแน่ใจหรือไม่?",
    "common.yes": "ใช่",
    "common.no": "ไม่",
    "common.expires": "หมดอายุ",
    "common.batch": "แบทช์",
    "common.in_stock": "มีในสต็อก",
    "common.low_stock": "สต็อกต่ำ",
    "common.out_of_stock": "สินค้าหมด",
    "common.no_data": "ไม่มีข้อมูล",
    "common.search": "ค้นหา",
    "common.filter": "กรอง",
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
  return (translations[language] as any)?.[key] || key;
}
