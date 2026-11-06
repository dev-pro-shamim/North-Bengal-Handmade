'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductItem } from '@/lib/allProductsData';
import { InquiryItem, CompanySettings, CategoryItem, SiteContent } from '@/lib/store';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'gallery' | 'content' | 'inquiries' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);

  // Core Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('All');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'quoted' | 'closed'>('all');
  const [gallerySearch, setGallerySearch] = useState('');

  // Notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Product Modal State
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem>>({ images: [] });
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Modal State
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem>>({});

  // Gallery Item Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<ProductItem | null>(null);

  // Email Reply Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Content CMS Save State
  const [savingContent, setSavingContent] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Helper Toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Initial Authentication & Data Hydration
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.push('/admin/login');
          return;
        }
        const authData = await authRes.json();
        setAdminUser(authData.user);

        // Fetch all operational data in parallel
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSiteContent(),
          fetchInquiries(),
          fetchSettings()
        ]);
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSiteContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.content) setSiteContent(data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    router.push('/admin/login');
  };

  // ================= MULTIPLE FILE UPLOAD HANDLER =================

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const newUrls: string[] = data.urls || [];
      const existingImages = editingProduct.images || (editingProduct.image ? [editingProduct.image] : []);
      const combined = [...existingImages, ...newUrls];

      setEditingProduct({
        ...editingProduct,
        image: combined[0],
        thumb: combined[0],
        images: combined
      });

      showToast(`Uploaded ${newUrls.length} image(s) successfully!`);
    } catch (err: any) {
      showToast(err.message || 'Image upload error', 'error');
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeProductImage = (idxToRemove: number) => {
    const currentImages = editingProduct.images || [];
    const updated = currentImages.filter((_, idx) => idx !== idxToRemove);
    setEditingProduct({
      ...editingProduct,
      image: updated[0] || '',
      thumb: updated[0] || '',
      images: updated
    });
  };

  const setCoverImage = (imgUrl: string) => {
    const currentImages = editingProduct.images || [];
    const reordered = [imgUrl, ...currentImages.filter(url => url !== imgUrl)];
    setEditingProduct({
      ...editingProduct,
      image: imgUrl,
      thumb: imgUrl,
      images: reordered
    });
  };

  // ================= PRODUCT CRUD HANDLERS =================

  const openCreateProduct = () => {
    const defaultCat = categories[0]?.name || 'Storage Baskets';
    setEditingProduct({
      title: '',
      category: defaultCat,
      material: '100% Wild River Seagrass & Golden Jute',
      structure: 'Rectangular with Inset Handles',
      image: '/assets/products-gallery/nb-prod-01.jpg',
      thumb: '/assets/products-gallery/nb-prod-01-thumb.jpg',
      images: ['/assets/products-gallery/nb-prod-01.jpg'],
      moq: '500 pcs',
      leadTime: '25-35 Days FOB Chittagong (BDCGP)',
      compliance: 'Phytosanitary & Fumigation Certified',
      origin: 'Kaunia, Rangpur, Bangladesh',
      featured: false
    });
    setProductModalMode('create');
  };

  const openEditProduct = (prod: ProductItem) => {
    setEditingProduct({
      ...prod,
      images: prod.images && prod.images.length > 0 ? prod.images : [prod.image]
    });
    setProductModalMode('edit');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productModalMode === 'create') {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        if (!res.ok) throw new Error('Create failed');
        showToast('New product created successfully!');
      } else if (productModalMode === 'edit') {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        if (!res.ok) throw new Error('Update failed');
        showToast('Product updated successfully!');
      }
      await fetchProducts();
      await fetchCategories();
      setProductModalMode(null);
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted "${title}"`);
        await fetchProducts();
        await fetchCategories();
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  // ================= CATEGORY CRUD HANDLERS =================

  const openCreateCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      icon: '🧺'
    });
    setCategoryModalMode('create');
  };

  const openEditCategory = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setCategoryModalMode('edit');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (categoryModalMode === 'create') {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory)
        });
        if (!res.ok) throw new Error('Failed to create category');
        showToast('Category created!');
      } else if (categoryModalMode === 'edit') {
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory)
        });
        if (!res.ok) throw new Error('Failed to update category');
        showToast('Category updated!');
      }
      await fetchCategories();
      setCategoryModalMode(null);
    } catch (err: any) {
      showToast(err.message || 'Category error', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Existing products in this category will keep their tags.`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Category "${name}" deleted`);
        await fetchCategories();
      }
    } catch (err) {
      showToast('Error deleting category', 'error');
    }
  };

  // ================= GALLERY ITEM HANDLER =================

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGalleryItem)
      });
      if (res.ok) {
        showToast('Gallery image metadata updated!');
        await fetchProducts();
        setGalleryModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to update gallery image', 'error');
    }
  };

  // ================= SITE CONTENT CMS HANDLER =================

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;
    setSavingContent(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteContent)
      });
      if (res.ok) {
        showToast('Site content updated! Changes are now live on public website.');
      }
    } catch (err) {
      showToast('Error saving site content', 'error');
    } finally {
      setSavingContent(false);
    }
  };

  // ================= INQUIRY & EMAIL DISPATCHER =================

  const handleStatusChange = async (id: string, status: InquiryItem['status']) => {
    const res = await fetch('/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      fetchInquiries();
      showToast(`Status updated to ${status}`);
    }
  };

  const openEmailModal = (inq: InquiryItem) => {
    setSelectedInquiry(inq);
    setEmailSubject(`Formal Quotation: ${inq.details?.product || inq.reference} - North Bengal Handmade Products BD`);
    setEmailMessage(
`Dear ${inq.customer.name},

Thank you for your interest in North Bengal Handmade Products BD. We have received your export inquiry [Ref: ${inq.reference}] for:
• Product: ${inq.details?.product || 'Handcrafted Collection'}
• Target Quantity: ${inq.details?.quantity || 'Standard Container Batch'}
• Preferred Incoterm: ${inq.details?.incoterm || 'FOB Chittagong (BDCGP)'}

We are pleased to provide you with our official factory proposal:
1. Unit Price: $____ USD / pc (FOB Chittagong Seaport)
2. Production Lead Time: 30-35 days from L/C confirmation
3. Export Packaging: 5-ply export master carton with silica gel humidity control
4. Certifications: Phytosanitary & Certificate of Origin included

Please let us know if you require counter-samples dispatched to your office.

Best regards,
Commercial Merchandising Desk
North Bengal Handmade Products BD
House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230, Bangladesh`
    );
    setEmailModalOpen(true);
  };

  const applyEmailTemplate = (templateType: string) => {
    if (!selectedInquiry) return;
    if (templateType === 'quote') {
      setEmailSubject(`Official FOB Quotation [${selectedInquiry.reference}]: ${selectedInquiry.details?.product || 'Handmade Products'}`);
      setEmailMessage(
`Dear ${selectedInquiry.customer.name},

Thank you for your commercial inquiry [Ref: ${selectedInquiry.reference}].

Here is our official factory offer:
• Item: ${selectedInquiry.details?.product}
• Target Quantity: ${selectedInquiry.details?.quantity}
• Term: ${selectedInquiry.details?.incoterm}
• FOB Chittagong Price: $_____ USD/set
• Lead Time: 25-30 days

Payment: 100% Irrevocable L/C at sight or 30% TT advance, balance upon B/L copy.

Awaiting your confirmation to prepare pre-production samples.

Warm regards,
Md. Abdullah Al Mamun
Director of Export Operations`
      );
    } else if (templateType === 'sample') {
      setEmailSubject(`Counter-Sample Dispatch Alert [${selectedInquiry.reference}]`);
      setEmailMessage(
`Dear ${selectedInquiry.customer.name},

Your handcrafted counter-sample for "${selectedInquiry.details?.product}" has been completed by our master artisans in Kaunia, Rangpur.

• Courier: DHL Express / FedEx
• Tracking No: ________________
• Estimated Delivery: 4-5 business days

Please review the weave density, handles, and natural fiber aroma. We look forward to receiving your feedback.

Best regards,
North Bengal Export Desk`
      );
    } else if (templateType === 'visit') {
      setEmailSubject(`Invitation to Visit our Kaunia, Rangpur Artisan Center [${selectedInquiry.reference}]`);
      setEmailMessage(
`Dear ${selectedInquiry.customer.name},

We would be delighted to host your inspection team for a direct factory and workshop audit in Kaunia, Rangpur, Bangladesh.

We will arrange:
• Airport pickup at Saidpur Airport (SPD)
• Guided tour of horizontal pit-looms and raw jute spinning yards
• Direct meeting with our rural women artisan cooperatives

Please let us know your planned travel schedule.

Best regards,
North Bengal Executive Team`
      );
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setSendingEmail(true);

    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          to: selectedInquiry.customer.email,
          toName: selectedInquiry.customer.name,
          subject: emailSubject,
          message: emailMessage,
          inquiryRef: selectedInquiry.reference,
          productTitle: selectedInquiry.details?.product
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');

      showToast(data.message || 'Email dispatched successfully!');
      fetchInquiries();
      setEmailModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error sending email', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  // ================= SETTINGS HANDLER =================

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast('Company particulars & legal credentials saved successfully!');
      }
    } catch (err) {
      showToast('Error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-stone-400 text-sm">Loading Enterprise CMS & Operations Console...</div>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchCat = productCatFilter === 'All' || p.category === productCatFilter;
    const q = productSearch.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.itemNo.toLowerCase().includes(q) || p.material.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const filteredInquiries = inquiries.filter(inq => {
    if (inquiryFilter === 'all') return true;
    return inq.status === inquiryFilter;
  });

  const filteredGallery = products.filter(p => {
    const q = gallerySearch.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.itemNo.toLowerCase().includes(q);
  });

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-950 text-emerald-200 border-emerald-500' 
            : 'bg-red-950 text-red-200 border-red-500'
        }`}>
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. TOP HEADER & BRAND BAR */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-black text-sm shadow">
              NB
            </span>
            <div>
              <div className="font-extrabold text-sm tracking-wide text-white flex items-center gap-2">
                <span>North Bengal Handmade</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                  Enterprise CMS
                </span>
              </div>
              <div className="text-[10px] text-stone-400">Content Management & Global Export Console</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>Live Storefront ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. MAIN CMS SHELL */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDEBAR NAVIGATION TABS */}
        <aside className="w-full md:w-64 bg-stone-900/70 border-r border-stone-800 p-4 md:p-6 shrink-0 space-y-1.5">
          
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
            Operations & Control
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>📊</span>
              <span>Overview</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'products'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🧺</span>
              <span>Products (52+)</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
              activeTab === 'products' ? 'bg-stone-950 text-white' : 'bg-stone-800 text-stone-400'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🏷️</span>
              <span>Categories</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
              activeTab === 'categories' ? 'bg-stone-950 text-white' : 'bg-stone-800 text-stone-400'
            }`}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🖼️</span>
              <span>Gallery & Media</span>
            </span>
          </button>

          <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
            Site CMS & Inquiries
          </div>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'content'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>✏️</span>
              <span>Website Content CMS</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'inquiries'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>✉️</span>
              <span>Buyer Inquiries & RFQs</span>
            </span>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 animate-pulse">
                {newInquiriesCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🏢</span>
              <span>Company & Legal</span>
            </span>
          </button>

        </aside>

        {/* CMS MAIN WORKSPACE */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-hidden">
          
          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW & MASTER METRICS                               */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Master Operations <span className="text-amber-400">Overview</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-1">
                    Live enterprise snapshot of products, categories, media assets, buyer inquiries, and website content status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openCreateProduct}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5"
                  >
                    <span>+ New Product</span>
                  </button>
                  <button
                    onClick={openCreateCategory}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider transition border border-stone-700"
                  >
                    <span>+ New Category</span>
                  </button>
                </div>
              </div>

              {/* Master KPI Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div 
                  onClick={() => setActiveTab('products')} 
                  className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow cursor-pointer hover:border-amber-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-stone-400 text-xs font-semibold uppercase">
                    <span>Total Products</span>
                    <span className="text-amber-400 group-hover:scale-110 transition">🧺</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">{products.length}</div>
                  <div className="text-[11px] text-amber-400 mt-1">Across {categories.length} Categories</div>
                </div>

                <div 
                  onClick={() => setActiveTab('inquiries')} 
                  className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow cursor-pointer hover:border-amber-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-stone-400 text-xs font-semibold uppercase">
                    <span>Buyer Inquiries</span>
                    <span className="text-amber-400 group-hover:scale-110 transition">✉️</span>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-400 mt-2">{inquiries.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{newInquiriesCount} pending response</div>
                </div>

                <div 
                  onClick={() => setActiveTab('categories')} 
                  className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow cursor-pointer hover:border-amber-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-stone-400 text-xs font-semibold uppercase">
                    <span>Categories Active</span>
                    <span className="text-amber-400 group-hover:scale-110 transition">🏷️</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">{categories.length}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Dynamic Filtering Enabled</div>
                </div>

                <div 
                  onClick={() => setActiveTab('settings')} 
                  className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow cursor-pointer hover:border-amber-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-stone-400 text-xs font-semibold uppercase">
                    <span>Statutory Status</span>
                    <span className="text-emerald-400 group-hover:scale-110 transition">🛡️</span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-2">Verified</div>
                  <div className="text-[11px] text-stone-400 mt-1 font-mono">ERC: 260326211291422</div>
                </div>
              </div>

              {/* Quick Action Center */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-obsidian-900 to-stone-900 border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                    CMS Management Hub
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">Manage Storefront Content & Requisitions</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Every text, category, product image, and legal credential on this site can be updated directly from this panel.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('content')}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>✏️ Edit Hero & Stories</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>🖼️ Manage Gallery</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase transition flex items-center gap-1.5"
                  >
                    <span>✉️ View RFQ Inbox</span>
                  </button>
                </div>
              </div>

              {/* Grid: Recent Inquiries & Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Recent Inquiries */}
                <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
                    <h3 className="font-bold text-white text-sm">Recent International Buyer Inquiries</h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-amber-400 hover:underline text-xs font-semibold"
                    >
                      View All ({inquiries.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-800/80">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inq.customer.company}</span>
                            <span className="text-stone-400 text-xs">({inq.customer.name})</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inq.status === 'new' ? 'bg-amber-400/20 text-amber-300' :
                              inq.status === 'quoted' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-stone-700 text-stone-300'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                            {inq.details?.product} • Qty: {inq.details?.quantity}
                          </p>
                        </div>

                        <button
                          onClick={() => { setActiveTab('inquiries'); openEmailModal(inq); }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition self-start sm:self-auto shrink-0"
                        >
                          ✉️ Reply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Dynamic Category Breakdown */}
                <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
                    <h3 className="font-bold text-white text-sm">Active Product Categories</h3>
                    <button
                      onClick={() => setActiveTab('categories')}
                      className="text-amber-400 hover:underline text-xs font-semibold"
                    >
                      Manage →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {categories.map(cat => (
                      <div key={cat.id} className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{cat.icon || '🧺'}</span>
                          <div>
                            <div className="font-bold text-white">{cat.name}</div>
                            <div className="text-[10px] text-stone-400">{cat.slug}</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-amber-400 font-mono font-bold">
                          {cat.itemCount || 0} items
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PRODUCTS MANAGER (WITH MULTIPLE IMAGE UPLOAD)           */}
          {/* ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Products Catalog CMS <span className="text-amber-400">({products.length})</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Create, edit specifications, upload single or multiple high-res product photos, and delete catalog items.
                  </p>
                </div>

                <button
                  onClick={openCreateProduct}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>+ Add New Product</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search products by title, SKU, or fiber material..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <select
                  value={productCatFilter}
                  onChange={e => setProductCatFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="All">All Categories ({products.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.itemCount || 0})</option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-400 font-bold uppercase tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Thumb</th>
                        <th className="py-3 px-4">Title & Material</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Photos</th>
                        <th className="py-3 px-4">MOQ</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80">
                      {filteredProducts.map((p) => {
                        const imgCount = p.images?.length || 1;
                        return (
                          <tr key={p.id} className="hover:bg-stone-850/60 transition">
                            <td className="py-3 px-4">
                              <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 p-1 flex items-center justify-center shrink-0">
                                <img src={p.thumb || p.image} alt={p.title} className="w-full h-full object-contain" />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-sm line-clamp-1">{p.title}</div>
                              <div className="text-[11px] text-amber-400 font-mono mt-0.5">{p.itemNo}</div>
                              <div className="text-[11px] text-stone-400 mt-0.5">{p.material}</div>
                            </td>
                            <td className="py-3 px-4 text-stone-300">
                              <span className="px-2.5 py-1 rounded-md bg-stone-800 text-[11px] font-semibold">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-300 font-mono text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                                📷 {imgCount} photo{imgCount > 1 ? 's' : ''}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-300 font-mono">
                              {p.moq}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditProduct(p)}
                                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.title)}
                                  className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CATEGORIES MANAGER                                      */}
          {/* ============================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Category Management <span className="text-amber-400">({categories.length})</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Create custom categories. Any category added here instantly appears on the storefront filters and product forms.
                  </p>
                </div>

                <button
                  onClick={openCreateCategory}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>+ Create Category</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl p-2 rounded-xl bg-stone-950 border border-stone-800">
                          {cat.icon || '🧺'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold">
                          {cat.itemCount || 0} products
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-3">{cat.name}</h3>
                      <div className="text-[11px] font-mono text-stone-400 mt-0.5">Slug: {cat.slug}</div>
                      <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: GALLERY & MEDIA MANAGER                                 */}
          {/* ============================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Gallery & Visual Media CMS <span className="text-amber-400">({products.length} Photos)</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Inspect, update titles, categories, and manage which products appear in the Home Page Animated Slider.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search gallery photos..."
                    value={gallerySearch}
                    onChange={e => setGallerySearch(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={openCreateProduct}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow shrink-0"
                  >
                    + Upload New Photo
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredGallery.map((p) => (
                  <div
                    key={p.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow group hover:border-amber-400/60 transition flex flex-col justify-between"
                  >
                    <div className="aspect-square bg-stone-950 p-2 relative flex items-center justify-center">
                      <img src={p.thumb || p.image} alt={p.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                      
                      {p.featured && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[9px] font-bold uppercase">
                          Slider
                        </span>
                      )}
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-stone-900/80 text-stone-300 text-[9px] font-mono">
                        {p.itemNo}
                      </span>
                    </div>

                    <div className="p-3">
                      <div className="font-bold text-white text-xs line-clamp-1">{p.title}</div>
                      <div className="text-[10px] text-amber-400">{p.category}</div>
                      
                      <div className="mt-2.5 pt-2 border-t border-stone-800 flex justify-between items-center">
                        <button
                          onClick={() => { setEditingGalleryItem(p); setGalleryModalOpen(true); }}
                          className="text-[11px] text-stone-300 hover:text-amber-400 font-semibold"
                        >
                          ✏️ Update
                        </button>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {p.images?.length || 1} img
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: WEBSITE CONTENT CMS                                     */}
          {/* ============================================================== */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Website Content <span className="text-amber-400">CMS</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Live content editor for Hero banners, Export headers, Heritage story, SDG targets, and Port logistics.
                  </p>
                </div>

                <button
                  onClick={handleSaveContent}
                  disabled={savingContent}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 self-start sm:self-auto"
                >
                  {savingContent ? 'Publishing...' : '💾 Publish Content Live'}
                </button>
              </div>

              {siteContent && (
                <form onSubmit={handleSaveContent} className="space-y-8 text-xs">
                  
                  {/* HERO BANNER SECTION */}
                  <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                      1. Home Hero Banner & Metrics
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Hero Pill Badge</label>
                        <input
                          type="text"
                          value={siteContent.hero.badge}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, badge: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Catalog CTA Button Text</label>
                        <input
                          type="text"
                          value={siteContent.hero.ctaCatalogText}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, ctaCatalogText: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 font-bold uppercase mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={siteContent.hero.headline}
                        onChange={e => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, headline: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 font-bold uppercase mb-1">Subheading Paragraph</label>
                      <textarea
                        rows={3}
                        value={siteContent.hero.subheading}
                        onChange={e => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, subheading: e.target.value }
                        })}
                        className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                      />
                    </div>

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                        <label className="text-[10px] uppercase text-stone-400 block font-bold">Artisans Metric</label>
                        <input
                          type="text"
                          value={siteContent.hero.statArtisans}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, statArtisans: e.target.value }
                          })}
                          className="w-full bg-transparent text-amber-400 font-bold text-sm focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                        <label className="text-[10px] uppercase text-stone-400 block font-bold">Experience Metric</label>
                        <input
                          type="text"
                          value={siteContent.hero.statExperience}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, statExperience: e.target.value }
                          })}
                          className="w-full bg-transparent text-amber-400 font-bold text-sm focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                        <label className="text-[10px] uppercase text-stone-400 block font-bold">Export Markets</label>
                        <input
                          type="text"
                          value={siteContent.hero.statCountries}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, statCountries: e.target.value }
                          })}
                          className="w-full bg-transparent text-amber-400 font-bold text-sm focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                        <label className="text-[10px] uppercase text-stone-400 block font-bold">Biodegradable %</label>
                        <input
                          type="text"
                          value={siteContent.hero.statEco}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, statEco: e.target.value }
                          })}
                          className="w-full bg-transparent text-emerald-400 font-bold text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL EXPORT BANNER */}
                  <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                      2. Official Export Showcase Banner
                    </h3>

                    <div>
                      <label className="block text-stone-400 font-bold uppercase mb-1">Banner Tagline Quote</label>
                      <input
                        type="text"
                        value={siteContent.exportBanner.headline}
                        onChange={e => setSiteContent({
                          ...siteContent,
                          exportBanner: { ...siteContent.exportBanner, headline: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 font-bold uppercase mb-1">Banner Description</label>
                      <textarea
                        rows={3}
                        value={siteContent.exportBanner.description}
                        onChange={e => setSiteContent({
                          ...siteContent,
                          exportBanner: { ...siteContent.exportBanner, description: e.target.value }
                        })}
                        className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* HERITAGE & ESG COMMITMENTS */}
                  <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                      3. ESG & UN Sustainable Development Targets
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-amber-400 font-bold uppercase mb-1">SDG 1 (No Poverty)</label>
                        <textarea
                          rows={2}
                          value={siteContent.esg.sdg1}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            esg: { ...siteContent.esg, sdg1: e.target.value }
                          })}
                          className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-400 font-bold uppercase mb-1">SDG 5 (Gender Equality)</label>
                        <textarea
                          rows={2}
                          value={siteContent.esg.sdg5}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            esg: { ...siteContent.esg, sdg5: e.target.value }
                          })}
                          className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-blue-400 font-bold uppercase mb-1">SDG 12 (Responsible Consumption)</label>
                        <textarea
                          rows={2}
                          value={siteContent.esg.sdg12}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            esg: { ...siteContent.esg, sdg12: e.target.value }
                          })}
                          className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-400 font-bold uppercase mb-1">SDG 13 (Climate Action)</label>
                        <textarea
                          rows={2}
                          value={siteContent.esg.sdg13}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            esg: { ...siteContent.esg, sdg13: e.target.value }
                          })}
                          className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LOGISTICS & FREIGHT */}
                  <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                      4. Export Shipping & Container Logistics
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Nominated Seaport</label>
                        <input
                          type="text"
                          value={siteContent.logistics.port}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            logistics: { ...siteContent.logistics, port: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Container Capacities</label>
                        <input
                          type="text"
                          value={siteContent.logistics.containerSizes}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            logistics: { ...siteContent.logistics, containerSizes: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Lead Time Schedule</label>
                        <input
                          type="text"
                          value={siteContent.logistics.leadTime}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            logistics: { ...siteContent.logistics, leadTime: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Payment & L/C Protocols</label>
                        <input
                          type="text"
                          value={siteContent.logistics.paymentTerms}
                          onChange={e => setSiteContent({
                            ...siteContent,
                            logistics: { ...siteContent.logistics, paymentTerms: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingContent}
                      className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow"
                    >
                      {savingContent ? 'Publishing...' : '💾 Publish Content Changes'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: INQUIRIES & CUSTOM EMAIL DISPATCHER                     */}
          {/* ============================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Buyer Queries & RFQs <span className="text-amber-400">({inquiries.length})</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Review customer custom quotes and dispatch official letters directly to buyer inboxes.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-900 p-1.5 rounded-2xl border border-stone-800">
                  {(['all', 'new', 'quoted', 'closed'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setInquiryFilter(f)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition ${
                        inquiryFilter === f ? 'bg-amber-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiry Cards */}
              <div className="space-y-4">
                {filteredInquiries.length === 0 ? (
                  <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-3xl text-stone-400 text-xs">
                    No inquiries found.
                  </div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-white text-base">
                              {inq.customer.company}
                            </span>
                            <span className="text-xs text-stone-400">
                              Attn: <strong>{inq.customer.name}</strong>
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                              {inq.reference}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-stone-400 mt-1">
                            <span>📧 {inq.customer.email}</span>
                            {inq.customer.phone && <span>📞 {inq.customer.phone}</span>}
                            <span>📅 {new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                            className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-bold text-white focus:outline-none"
                          >
                            <option value="new">🟡 New</option>
                            <option value="quoted">🟢 Quoted</option>
                            <option value="closed">⚪ Closed</option>
                          </select>

                          <button
                            onClick={() => openEmailModal(inq)}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase transition"
                          >
                            ✉️ Send Custom Email
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
                        <div>
                          <span className="text-stone-500 block">Requested Product:</span>
                          <strong className="text-amber-300">{inq.details?.product || 'Custom Collection'}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Quantity & Incoterm:</span>
                          <span className="text-stone-300">{inq.details?.quantity} ({inq.details?.incoterm})</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Destination Port:</span>
                          <span className="text-stone-300">{inq.details?.destination || 'Global Seaport'}</span>
                        </div>
                      </div>

                      {inq.details?.notes && (
                        <div className="text-xs text-stone-400 bg-stone-950/40 p-3 rounded-xl border border-stone-800/50">
                          <strong className="text-stone-300">Customer Notes:</strong> {inq.details.notes}
                        </div>
                      )}

                      {inq.communications && inq.communications.length > 0 && (
                        <div className="pt-2 border-t border-stone-800">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            Email History ({inq.communications.length})
                          </div>
                          <div className="space-y-2">
                            {inq.communications.map((comm, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-stone-950 border border-emerald-900/40 text-xs">
                                <div className="flex justify-between text-stone-400 text-[10px] mb-1">
                                  <span>To: {inq.customer.email}</span>
                                  <span>{new Date(comm.sentAt).toLocaleString()}</span>
                                </div>
                                <div className="font-bold text-white">{comm.subject}</div>
                                <div className="text-stone-400 mt-1 whitespace-pre-wrap text-[11px] line-clamp-3">
                                  {comm.body}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: COMPANY & LEGAL SETTINGS                                */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  Statutory Particulars & Credentials
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">
                  Update government registration numbers, nominated bank, and corporate addresses.
                </p>
              </div>

              {settings && (
                <form onSubmit={handleSaveSettings} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
                      Government Verification Particulars
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">ERC Number (Export Reg)</label>
                        <input
                          type="text"
                          value={settings.ercNumber}
                          onChange={e => setSettings({ ...settings, ercNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">BIN / VAT Registration</label>
                        <input
                          type="text"
                          value={settings.binNumber}
                          onChange={e => setSettings({ ...settings, binNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">e-TIN Number</label>
                        <input
                          type="text"
                          value={settings.etinNumber}
                          onChange={e => setSettings({ ...settings, etinNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Trade License (Rangpur)</label>
                        <input
                          type="text"
                          value={settings.tradeLicense}
                          onChange={e => setSettings({ ...settings, tradeLicense: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
                      Bank & Contact Hubs
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Nominated Bank Name</label>
                        <input
                          type="text"
                          value={settings.bankName}
                          onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Bank Branch</label>
                        <input
                          type="text"
                          value={settings.bankBranch}
                          onChange={e => setSettings({ ...settings, bankBranch: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Official Export Email</label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">WhatsApp Export Desk</label>
                        <input
                          type="text"
                          value={settings.whatsapp}
                          onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow"
                    >
                      {savingSettings ? 'Saving Settings...' : 'Save Settings Changes'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT (WITH MULTIPLE IMAGE UPLOAD)         */}
      {/* ============================================================== */}
      {productModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-xs relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProductModalMode(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {productModalMode === 'create' ? 'Add New Handcrafted Product' : 'Edit Product Specifications'}
            </h3>
            <p className="text-stone-400 text-xs mb-6">
              Manage product titles, multiple high-res gallery images, category assignments, and export terms.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              {/* Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-bold uppercase mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Kaunia Rectangular Seagrass Storage Baskets (Set of 3)"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Item Code / SKU</label>
                  <input
                    type="text"
                    value={editingProduct.itemNo || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, itemNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono focus:outline-none focus:border-amber-400"
                    placeholder="e.g. NB-EXP-153"
                  />
                </div>
              </div>

              {/* Dynamic Category & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Category *</label>
                  <select
                    value={editingProduct.category || categories[0]?.name}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Material Composition *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.material || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 100% Wild River Seagrass & Golden Jute"
                  />
                </div>
              </div>

              {/* Structure, MOQ, Lead time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Structural Shape</label>
                  <input
                    type="text"
                    value={editingProduct.structure || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, structure: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Rectangular with Inset Handles"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Export MOQ</label>
                  <input
                    type="text"
                    value={editingProduct.moq || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, moq: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 300 - 500 pcs"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Lead Time & Port</label>
                  <input
                    type="text"
                    value={editingProduct.leadTime || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, leadTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 25-35 Days FOB Chittagong"
                  />
                </div>
              </div>

              {/* MULTIPLE IMAGE UPLOAD ZONE */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-white block">Product Photos (Multiple Image Upload)</label>
                    <span className="text-[11px] text-stone-400">Select multiple high-resolution photos. The first image will be the primary cover.</span>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={uploadingFiles}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    {uploadingFiles ? 'Uploading...' : '📁 Upload Image(s)'}
                  </button>
                </div>

                {/* Thumbnails of attached images */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {editingProduct.images && editingProduct.images.length > 0 ? (
                    editingProduct.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl bg-stone-900 border border-stone-700 p-1 flex items-center justify-center group/img">
                        <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                        
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1 rounded bg-amber-500 text-stone-950 text-[8px] font-bold uppercase">
                            Cover
                          </span>
                        )}

                        <div className="absolute inset-0 bg-stone-950/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setCoverImage(imgUrl)}
                              className="px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[9px] font-bold"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeProductImage(idx)}
                            className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-4 text-stone-400 text-xs">
                      No images attached yet. Click "Upload Image(s)" above or enter an image URL below.
                    </div>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="pt-2">
                  <label className="text-[11px] text-stone-400 font-semibold block mb-1">Or Primary Image URL Path:</label>
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={e => {
                      const url = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        image: url,
                        thumb: url,
                        images: editingProduct.images && editingProduct.images.length > 0 ? [url, ...editingProduct.images.slice(1)] : [url]
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs font-mono"
                    placeholder="/assets/products-gallery/nb-prod-01.jpg"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={Boolean(editingProduct.featured)}
                  onChange={e => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="featuredToggle" className="text-xs text-stone-300 font-semibold cursor-pointer">
                  Feature this product in the Home Page Animated Showcase Slider
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setProductModalMode(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase text-xs shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE / EDIT CATEGORY                                  */}
      {/* ============================================================== */}
      {categoryModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-xs relative">
            <button
              onClick={() => setCategoryModalMode(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {categoryModalMode === 'create' ? 'Create New Category' : 'Edit Category'}
            </h3>
            <p className="text-stone-400 text-xs mb-6">
              Add custom categories for product classification and website navigation.
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-stone-300 font-bold uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Planters & Pots"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase mb-1">Icon / Emoji</label>
                <input
                  type="text"
                  value={editingCategory.icon || '🧺'}
                  onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-base focus:outline-none focus:border-amber-400"
                  placeholder="e.g. 🪴 or 🧺"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full p-4 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  placeholder="Brief description of products in this category..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setCategoryModalMode(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase text-xs shadow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: UPDATE GALLERY IMAGE                                    */}
      {/* ============================================================== */}
      {galleryModalOpen && editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-xs relative">
            <button
              onClick={() => setGalleryModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Update Gallery Photo</h3>
            <p className="text-stone-400 text-xs mb-4">Edit image title, category tag, and slider visibility.</p>

            <div className="aspect-video w-full bg-stone-950 rounded-2xl p-2 mb-4 flex items-center justify-center border border-stone-800">
              <img src={editingGalleryItem.image} alt={editingGalleryItem.title} className="h-full w-auto object-contain" />
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-stone-300 font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title}
                  onChange={e => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase mb-1">Category</label>
                <select
                  value={editingGalleryItem.category}
                  onChange={e => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="galleryFeatured"
                  checked={Boolean(editingGalleryItem.featured)}
                  onChange={e => setEditingGalleryItem({ ...editingGalleryItem, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <label htmlFor="galleryFeatured" className="text-stone-300 font-semibold cursor-pointer">
                  Display in Home Page Animated Sliding Stream
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase text-xs shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CUSTOM EMAIL DISPATCHER                                 */}
      {/* ============================================================== */}
      {emailModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-xs relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEmailModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                Direct Buyer Email Dispatcher
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Reply to {selectedInquiry.customer.company}
              </h3>
              <p className="text-stone-400 text-xs">
                To: <strong className="text-amber-400">{selectedInquiry.customer.email}</strong> (Attn: {selectedInquiry.customer.name})
              </p>
            </div>

            {/* Quick Templates */}
            <div className="mb-4 p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center gap-2 flex-wrap">
              <span className="text-stone-400 font-semibold text-[11px]">Templates:</span>
              <button
                type="button"
                onClick={() => applyEmailTemplate('quote')}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 text-[11px] font-medium transition"
              >
                FOB Quotation
              </button>
              <button
                type="button"
                onClick={() => applyEmailTemplate('sample')}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 text-[11px] font-medium transition"
              >
                Sample Tracking
              </button>
              <button
                type="button"
                onClick={() => applyEmailTemplate('visit')}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 text-[11px] font-medium transition"
              >
                Factory Visit
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-stone-400 font-bold uppercase mb-1">Subject Line *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold uppercase mb-1">Message Body *</label>
                <textarea
                  required
                  rows={9}
                  value={emailMessage}
                  onChange={e => setEmailMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-[11px] text-stone-400">
                  Dispatches under North Bengal letterhead.
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5"
                  >
                    {sendingEmail ? 'Dispatching...' : 'Send Email →'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
