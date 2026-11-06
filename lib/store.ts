import fs from 'fs';
import path from 'path';
import { ProductItem } from '@/lib/allProductsData';

const dataDir = path.join(process.cwd(), 'data');
const catalogPath = path.join(dataDir, 'full-catalog.json');
const inquiriesPath = path.join(dataDir, 'inquiries.json');
const settingsPath = path.join(dataDir, 'settings.json');
const categoriesPath = path.join(dataDir, 'categories.json');
const siteContentPath = path.join(dataDir, 'site-content.json');

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  itemCount?: number;
}

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

export interface SiteContent {
  hero: {
    badge: string;
    headline: string;
    subheading: string;
    ctaCatalogText: string;
    ctaQuoteText: string;
    statArtisans: string;
    statArtisansLabel: string;
    statExperience: string;
    statExperienceLabel: string;
    statCountries: string;
    statCountriesLabel: string;
    statEco: string;
    statEcoLabel: string;
  };
  exportBanner: {
    badge: string;
    headline: string;
    description: string;
    tag1: string;
    tag2: string;
  };
  heritage: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
  };
  esg: {
    sdg1: string;
    sdg5: string;
    sdg12: string;
    sdg13: string;
  };
  logistics: {
    port: string;
    airport: string;
    containerSizes: string;
    inspectionStandard: string;
    leadTime: string;
    paymentTerms: string;
  };
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
    const list: ProductItem[] = JSON.parse(raw);
    return list.map(item => ({
      ...item,
      images: item.images && item.images.length > 0 ? item.images : [item.image]
    }));
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

  const imagesList = item.images && item.images.length > 0 
    ? item.images 
    : [item.image || '/assets/products-gallery/nb-prod-01.jpg'];

  const newProduct: ProductItem = {
    ...item,
    id,
    slug,
    image: imagesList[0],
    thumb: item.thumb || imagesList[0],
    images: imagesList
  };

  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const current = products[idx];
  const imagesList = updates.images && updates.images.length > 0
    ? updates.images
    : (updates.image ? [updates.image] : current.images || [current.image]);

  products[idx] = { 
    ...current, 
    ...updates,
    image: imagesList[0],
    thumb: updates.thumb || imagesList[0],
    images: imagesList
  };

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

// ================= CATEGORIES CRUD =================

export function getCategories(): CategoryItem[] {
  ensureDataDir();
  if (!fs.existsSync(categoriesPath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(categoriesPath, 'utf-8');
    const categories: CategoryItem[] = JSON.parse(raw);
    
    // Recalculate dynamic item counts from current products
    const products = getProducts();
    return categories.map(cat => ({
      ...cat,
      itemCount: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
    }));
  } catch (err) {
    console.error('Error reading categories:', err);
    return [];
  }
}

export function saveCategories(categories: CategoryItem[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving categories:', err);
    return false;
  }
}

export function createCategory(cat: Omit<CategoryItem, 'id' | 'slug' | 'itemCount'>): CategoryItem {
  const categories = getCategories();
  const slug = cat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const id = `cat-${Date.now().toString().slice(-6)}`;

  const newCat: CategoryItem = {
    ...cat,
    id,
    slug,
    itemCount: 0
  };

  categories.push(newCat);
  saveCategories(categories);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
  const categories = getCategories();
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return null;

  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  }

  categories[idx] = { ...categories[idx], ...updates };
  saveCategories(categories);
  return categories[idx];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;

  saveCategories(filtered);
  return true;
}

// ================= SITE CONTENT CMS =================

export function getSiteContent(): SiteContent {
  ensureDataDir();
  if (!fs.existsSync(siteContentPath)) {
    return {
      hero: {
        badge: "100% Export-Grade Natural Fiber Products",
        headline: "Crafting Sustainable Elegance from Northern Bengal",
        subheading: "Direct factory manufacturer and exporter of handcrafted storage baskets, planters, and home living collections. Ethically created by master rural women artisans since 2011.",
        ctaCatalogText: "Explore 52 Products Gallery",
        ctaQuoteText: "Request Custom Export Quote",
        statArtisans: "500+",
        statArtisansLabel: "Master Women Artisans",
        statExperience: "13+ Years",
        statExperienceLabel: "Global Exporting History",
        statCountries: "18+ Markets",
        statCountriesLabel: "USA, EU, UK & Japan",
        statEco: "100%",
        statEcoLabel: "Biodegradable Fibers"
      },
      exportBanner: {
        badge: "Official Export Banner",
        headline: "\"Ethically Handmade | Naturally Beautiful | Certified for Global Standards\"",
        description: "Exporting handmade excellence from Northern Bangladesh since 2011. Direct manufacturers of wild Kaisa grass storage baskets, coiled seagrass hampers, braided golden jute planters, and sustainable lifestyle carry goods.",
        tag1: "100% Eco-Friendly (Kaisa, Seagrass & Jute)",
        tag2: "Wholesale Direct (FOB Chittagong Sea Freight)"
      },
      heritage: {
        badge: "Artisanal Heritage & ESG Commitment",
        title: "Preserving Ancestral Looming in Kaunia, Rangpur",
        p1: "Rooted along the fertile riverbanks of Northern Bangladesh, our craft preserves centuries of horizontal pit-loom weaving, wild grass foraging, and natural rope braiding.",
        p2: "Over 85% of our workforce consists of skilled rural female artisans who gain independent livelihood, healthcare, and fair wages under strict ethical fair-trade conditions."
      },
      esg: {
        sdg1: "Steady living wages directly paid to rural craft households across Northern Bengal.",
        sdg5: "Empowering 85%+ rural female artisans with leadership and financial independence.",
        sdg12: "100% biodegradable natural fibers replacing non-recyclable petroleum plastics.",
        sdg13: "Carbon-negative golden jute handloomed without industrial greenhouse emissions."
      },
      logistics: {
        port: "Chittagong Seaport (BDCGP)",
        airport: "Hazrat Shahjalal International Airport, Dhaka (DAC)",
        containerSizes: "20ft FCL (28-30 CBM) | 40ft HC (65-68 CBM)",
        inspectionStandard: "Phytosanitary Certification, Fumigation Treatment & Certificate of Origin",
        leadTime: "25-35 Days from Irrevocable L/C confirmation",
        paymentTerms: "Irrevocable L/C at Sight or 30% Advance TT, balance upon Bill of Lading"
      }
    };
  }
  try {
    const raw = fs.readFileSync(siteContentPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading site content:', err);
    return {} as SiteContent;
  }
}

export function saveSiteContent(content: SiteContent): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(siteContentPath, JSON.stringify(content, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving site content:', err);
    return false;
  }
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
