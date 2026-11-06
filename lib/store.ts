import fs from 'fs';
import path from 'path';
import { ProductItem } from '@/lib/allProductsData';

const dataDir = path.join(process.cwd(), 'data');
const catalogPath = path.join(dataDir, 'full-catalog.json');
const inquiriesPath = path.join(dataDir, 'inquiries.json');
const settingsPath = path.join(dataDir, 'settings.json');

export interface InquiryItem {
  id: string;
  reference: string;
  createdAt: string;
  type: 'rfq' | 'custom_quote' | 'contact';
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  customer: {
    name: string;
    company: string;
    email: string;
    phone: string;
    country?: string;
  };
  details: {
    product?: string;
    quantity?: string;
    incoterm?: string;
    destination?: string;
    notes?: string;
  };
  communications?: Array<{
    sentAt: string;
    sender: string;
    subject: string;
    body: string;
  }>;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  ercNumber: string;
  binNumber: string;
  etinNumber: string;
  tradeLicense: string;
  bankName: string;
  bankBranch: string;
  contactPhone: string;
  whatsapp: string;
  contactEmail: string;
  supportEmail: string;
  corporateAddress: string;
  factoryAddress: string;
}

// Ensure directory exists
function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// ================= PRODUCTS CRUD =================

export function getProducts(): ProductItem[] {
  ensureDataDir();
  if (!fs.existsSync(catalogPath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(catalogPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading catalog:', err);
    return [];
  }
}

export function saveProducts(products: ProductItem[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing catalog:', err);
    return false;
  }
}

export function createProduct(item: Omit<ProductItem, 'id' | 'slug'>): ProductItem {
  const products = getProducts();
  const nextNum = products.length + 1;
  const id = `nb-prod-${String(nextNum).padStart(2, '0')}`;
  const slug = `artisan-handmade-${id}-${Date.now().toString().slice(-4)}`;

  const newProduct: ProductItem = {
    ...item,
    id,
    slug
  };

  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;

  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;

  saveProducts(filtered);
  return true;
}

// ================= INQUIRIES CRUD =================

export function getInquiries(): InquiryItem[] {
  ensureDataDir();
  if (!fs.existsSync(inquiriesPath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(inquiriesPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading inquiries:', err);
    return [];
  }
}

export function saveInquiries(inquiries: InquiryItem[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(inquiriesPath, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving inquiries:', err);
    return false;
  }
}

export function addInquiry(item: Omit<InquiryItem, 'id' | 'createdAt'>): InquiryItem {
  const inquiries = getInquiries();
  const newInquiry: InquiryItem = {
    ...item,
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: InquiryItem['status']): boolean {
  const inquiries = getInquiries();
  const target = inquiries.find(inq => inq.id === id);
  if (!target) return false;

  target.status = status;
  saveInquiries(inquiries);
  return true;
}

export function addInquiryReply(id: string, reply: { sender: string; subject: string; body: string }): boolean {
  const inquiries = getInquiries();
  const target = inquiries.find(inq => inq.id === id);
  if (!target) return false;

  if (!target.communications) target.communications = [];
  target.communications.push({
    ...reply,
    sentAt: new Date().toISOString()
  });

  // Automatically promote to 'quoted' or 'contacted' if still 'new'
  if (target.status === 'new') {
    target.status = 'quoted';
  }

  saveInquiries(inquiries);
  return true;
}

export function deleteInquiry(id: string): boolean {
  const inquiries = getInquiries();
  const filtered = inquiries.filter(inq => inq.id !== id);
  if (filtered.length === inquiries.length) return false;

  saveInquiries(filtered);
  return true;
}

// ================= SETTINGS CRUD =================

export function getSettings(): CompanySettings {
  ensureDataDir();
  if (!fs.existsSync(settingsPath)) {
    return {
      companyName: "North Bengal Handmade Products BD",
      tagline: "Ethically Handmade | Naturally Beautiful | Certified for Global Standards",
      ercNumber: "260326211291422",
      binNumber: "004681231-0102",
      etinNumber: "465746253246",
      tradeLicense: "No. 147",
      bankName: "Agrani Bank Ltd.",
      bankBranch: "Gazipur Corporate Branch",
      contactPhone: "+8801740305936",
      whatsapp: "8801740305936",
      contactEmail: "export@northbengalhandmade.com",
      supportEmail: "info@northbengalhandmade.com",
      corporateAddress: "House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230, Bangladesh",
      factoryAddress: "Sarai, Lalbagh, Kaunia Upazila, Rangpur-5440, Bangladesh"
    };
  }
  try {
    const raw = fs.readFileSync(settingsPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading settings:', err);
    return {} as CompanySettings;
  }
}

export function saveSettings(settings: CompanySettings): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing settings:', err);
    return false;
  }
}
