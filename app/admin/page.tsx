'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductItem } from '@/lib/allProductsData';
import { InquiryItem, CompanySettings } from '@/lib/store';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inquiries' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);

  // Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('All');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'quoted' | 'closed'>('all');

  // Modals
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem>>({});
  
  // Email Reply Modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Settings Save State
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // 1. Initial Authentication & Data Fetch
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

        // Fetch all initial data
        await Promise.all([fetchProducts(), fetchInquiries(), fetchSettings()]);
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

  // ================= PRODUCT CRUD HANDLERS =================

  const openCreateProduct = () => {
    setEditingProduct({
      title: '',
      category: 'Storage Baskets',
      material: '100% Natural Kaunia Seagrass',
      structure: 'Rectangular with Inset Handles',
      image: '/assets/products-gallery/nb-prod-01.jpg',
      moq: '500 pcs',
      leadTime: '25-35 Days FOB Chittagong (BDCGP)',
      compliance: 'Phytosanitary & Fumigation Certified',
      origin: 'Kaunia, Rangpur, Bangladesh',
      featured: false
    });
    setProductModalMode('create');
  };

  const openEditProduct = (prod: ProductItem) => {
    setEditingProduct({ ...prod });
    setProductModalMode('edit');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productModalMode === 'create') {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        await fetchProducts();
        setProductModalMode(null);
      }
    } else if (productModalMode === 'edit') {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        await fetchProducts();
        setProductModalMode(null);
      }
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchProducts();
    }
  };

  // ================= INQUIRY & EMAIL HANDLERS =================

  const handleStatusChange = async (id: string, status: InquiryItem['status']) => {
    const res = await fetch('/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      fetchInquiries();
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer inquiry?')) return;
    const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchInquiries();
    }
  };

  const openEmailModal = (inq: InquiryItem) => {
    setSelectedInquiry(inq);
    setEmailSubject(`Formal Quotation: ${inq.details?.product || inq.reference} - North Bengal Handmade Products BD`);
    setEmailMessage(
`Dear ${inq.customer.name},

Thank you for your interest in North Bengal Handmade Products BD. We have received your export inquiry [Ref: ${inq.reference}] for:
• Product: ${inq.details?.product || 'Handcrafted Collection'}
• Target Quantity: ${inq.details?.quantity || 'Standard Batch'}
• Incoterm: ${inq.details?.incoterm || 'FOB Chittagong (BDCGP)'}

We are pleased to provide you with our commercial factory proposal:
1. Unit Price: $____ USD / pc (FOB Chittagong Seaport)
2. Production Lead Time: 30-35 days from L/C confirmation
3. Export Packaging: 5-ply export master carton with silica gel humidity control
4. Certifications: Phytosanitary & Certificate of Origin included

Please let us know if you require counter-samples dispatched to your office.

Best regards,
Commercial Merchandising Desk
North Bengal Handmade Products BD`
    );
    setEmailFeedback(null);
    setEmailModalOpen(true);
  };

  const applyEmailTemplate = (templateType: string) => {
    if (!selectedInquiry) return;
    if (templateType === 'quote') {
      setEmailSubject(`Commercial Quotation [${selectedInquiry.reference}]: ${selectedInquiry.details?.product || 'Handmade Products'}`);
      setEmailMessage(
`Dear ${selectedInquiry.customer.name},

Thank you for your inquiry [Ref: ${selectedInquiry.reference}].

Here is our official factory offer:
• Item: ${selectedInquiry.details?.product}
• Target Quantity: ${selectedInquiry.details?.quantity}
• Term: ${selectedInquiry.details?.incoterm}
• FOB Price: $_____ USD/set
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

Please review the weave density, handles, and fiber aroma. We look forward to receiving your feedback.

Best regards,
North Bengal Export Desk`
      );
    } else if (templateType === 'visit') {
      setEmailSubject(`Invitation to Visit our Rangpur Artisan Center [${selectedInquiry.reference}]`);
      setEmailMessage(
`Dear ${selectedInquiry.customer.name},

We would be delighted to host your team for a direct factory and workshop inspection in Kaunia, Rangpur, Bangladesh.

We will arrange:
• Airport pickup at Saidpur Airport (SPD)
• Guided tour of our horizontal pit-looms and raw jute spinning yards
• Meeting with rural women artisan cooperatives

Please let us know your planned travel dates.

Best regards,
North Bengal Executive Team`
      );
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setSendingEmail(true);
    setEmailFeedback(null);

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

      setEmailFeedback({
        success: true,
        message: data.message || 'Email successfully processed.'
      });
      fetchInquiries();
    } catch (err: any) {
      setEmailFeedback({
        success: false,
        message: err.message || 'Error sending email'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // ================= SETTINGS HANDLER =================

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    setSettingsFeedback(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsFeedback('Company particulars and statutory credentials updated successfully!');
        setTimeout(() => setSettingsFeedback(null), 4000);
      }
    } catch (err) {
      setSettingsFeedback('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-stone-400 text-sm">Verifying secure admin session...</div>
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

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col">
      
      {/* 1. TOP NAVBAR */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
              NB
            </span>
            <span className="font-extrabold text-base tracking-wide text-white">
              North Bengal <span className="text-amber-400">Admin</span>
            </span>
          </Link>

          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            Authenticated: {adminUser?.username}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>Live Site ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-stone-900/60 border-r border-stone-800/80 p-4 md:p-6 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>📊</span>
              <span>Overview & Analytics</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'products'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🧺</span>
              <span>Products Manager</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
              activeTab === 'products' ? 'bg-stone-950 text-white' : 'bg-stone-800 text-stone-400'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
              activeTab === 'inquiries'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>✉️</span>
              <span>Inquiries & Emails</span>
            </span>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 animate-pulse">
                {newInquiriesCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
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

        {/* CONTENT VIEWPORT */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl">
          
          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Export Operations <span className="text-amber-400">Dashboard</span>
                </h2>
                <p className="text-stone-400 text-xs mt-1">
                  Real-time summary of catalog inventory, incoming customer inquiries, and commercial dispatches.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow">
                  <div className="text-stone-400 text-xs font-semibold uppercase">Total Catalog Items</div>
                  <div className="text-3xl font-extrabold text-white mt-2">{products.length}</div>
                  <div className="text-[11px] text-amber-400 mt-1">100% Studio Enhanced</div>
                </div>

                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow">
                  <div className="text-stone-400 text-xs font-semibold uppercase">Customer Inquiries</div>
                  <div className="text-3xl font-extrabold text-amber-400 mt-2">{inquiries.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{newInquiriesCount} pending review</div>
                </div>

                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow">
                  <div className="text-stone-400 text-xs font-semibold uppercase">Quoted & Dispatched</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-2">
                    {inquiries.filter(i => i.status === 'quoted').length}
                  </div>
                  <div className="text-[11px] text-emerald-300 mt-1">Commercial Offers Active</div>
                </div>

                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow">
                  <div className="text-stone-400 text-xs font-semibold uppercase">Export Verification</div>
                  <div className="text-3xl font-extrabold text-blue-400 mt-2">Active</div>
                  <div className="text-[11px] text-stone-400 mt-1 font-mono">ERC: 260326211291422</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 to-obsidian-950 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">Quick Catalog & Requisition Actions</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Direct shortcuts to add new handcrafted lines or answer buyer RFQs.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setActiveTab('products'); openCreateProduct(); }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase transition"
                  >
                    + Add New Product
                  </button>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold uppercase transition"
                  >
                    View Inquiries Inbox
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base">Recent International Buyer Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-amber-400 hover:underline text-xs font-semibold"
                  >
                    View All ({inquiries.length}) →
                  </button>
                </div>

                <div className="divide-y divide-stone-800">
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
                          Product: <strong className="text-stone-300">{inq.details?.product}</strong> • Qty: {inq.details?.quantity}
                        </p>
                      </div>

                      <button
                        onClick={() => { setActiveTab('inquiries'); openEmailModal(inq); }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition self-start sm:self-auto shrink-0"
                      >
                        ✉️ Reply Email
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: PRODUCTS MANAGER (CRUD) ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Products Inventory <span className="text-amber-400">({products.length})</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Create, update, and manage all export handmade products in the catalog.
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
                  placeholder="Search products by title, code, or material..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <select
                  value={productCatFilter}
                  onChange={e => setProductCatFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="All">All Categories</option>
                  <option value="Storage Baskets">Storage Baskets</option>
                  <option value="Planters & Pots">Planters & Pots</option>
                  <option value="Laundry & Hampers">Laundry & Hampers</option>
                  <option value="Home Accents & Trays">Home Accents & Trays</option>
                  <option value="Natural Fiber Rugs">Natural Fiber Rugs</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-400 font-bold uppercase tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Title & Material</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">MOQ</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80">
                      {filteredProducts.map((p) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: INQUIRIES & EMAIL DISPATCHER ================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Buyer Queries & RFQ Inbox <span className="text-amber-400">({inquiries.length})</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Review incoming quotation requests and send direct custom emails to buyers.
                  </p>
                </div>

                {/* Filter Tabs */}
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

              {/* Inquiry List Cards */}
              <div className="space-y-4">
                {filteredInquiries.length === 0 ? (
                  <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-3xl text-stone-400 text-xs">
                    No inquiries found for this filter.
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
                          {/* Status Select */}
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                            className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-bold text-white focus:outline-none"
                          >
                            <option value="new">🟡 New</option>
                            <option value="quoted">🟢 Quoted</option>
                            <option value="closed">⚪ Closed</option>
                          </select>

                          {/* Reply Button */}
                          <button
                            onClick={() => openEmailModal(inq)}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase transition"
                          >
                            ✉️ Send Custom Email
                          </button>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="text-stone-500 hover:text-red-400 text-xs p-1.5"
                            title="Delete Inquiry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Details Box */}
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
                          <strong className="text-stone-300">Customer Specification Notes:</strong> {inq.details.notes}
                        </div>
                      )}

                      {/* Prior Communications Thread */}
                      {inq.communications && inq.communications.length > 0 && (
                        <div className="pt-2 border-t border-stone-800">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            Dispatched Email History ({inq.communications.length})
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

          {/* ================= TAB 4: COMPANY & LEGAL SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  Statutory Credentials & Company Settings
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">
                  Update government registration numbers, nominated bank, and corporate addresses.
                </p>
              </div>

              {settingsFeedback && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-semibold">
                  ✓ {settingsFeedback}
                </div>
              )}

              {settings && (
                <form onSubmit={handleSaveSettings} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs">
                  
                  {/* Government Registrations */}
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

                  {/* Bank & Contact Details */}
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
                      Nominated Bank & Contact Hubs
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

                  {/* Physical Addresses */}
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
                      Physical Premises
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Corporate & Liaison Office (Dhaka)</label>
                        <input
                          type="text"
                          value={settings.corporateAddress}
                          onChange={e => setSettings({ ...settings, corporateAddress: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase mb-1">Manufacturing Center (Kaunia, Rangpur)</label>
                        <input
                          type="text"
                          value={settings.factoryAddress}
                          onChange={e => setSettings({ ...settings, factoryAddress: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow"
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

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {productModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-xs relative max-h-[90vh] overflow-y-auto">
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
              Fill in technical details for global buyer inspection and quote requisition.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'Storage Baskets'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Storage Baskets">Storage Baskets</option>
                    <option value="Planters & Pots">Planters & Pots</option>
                    <option value="Laundry & Hampers">Laundry & Hampers</option>
                    <option value="Home Accents & Trays">Home Accents & Trays</option>
                    <option value="Natural Fiber Rugs">Natural Fiber Rugs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Item Code / Export SKU</label>
                  <input
                    type="text"
                    value={editingProduct.itemNo || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, itemNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono focus:outline-none focus:border-amber-400"
                    placeholder="e.g. NB-EXP-153"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Structure / Shape</label>
                  <input
                    type="text"
                    value={editingProduct.structure || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, structure: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Rectangular with Inset Handles"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Standard Export MOQ</label>
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

              <div>
                <label className="block text-stone-300 font-bold uppercase mb-1">Image Asset Path / URL</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value, thumb: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  placeholder="/assets/products-gallery/nb-prod-01.jpg"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
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

      {/* ================= MODAL: CUSTOM EMAIL DISPATCHER ================= */}
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
                Custom Email Dispatcher
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
              <span className="text-stone-400 font-semibold text-[11px]">Quick Templates:</span>
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

            {emailFeedback && (
              <div className={`mb-4 p-3.5 rounded-xl text-xs font-semibold ${
                emailFeedback.success ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300' : 'bg-red-950/80 border border-red-500 text-red-300'
              }`}>
                {emailFeedback.message}
              </div>
            )}

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
                  rows={10}
                  value={emailMessage}
                  onChange={e => setEmailMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-[11px] text-stone-400">
                  Includes official North Bengal letterhead & credentials.
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
