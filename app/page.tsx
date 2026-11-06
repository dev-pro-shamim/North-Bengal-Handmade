'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductShowcaseSlider from '@/components/ProductShowcaseSlider';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'identity' | 'leadership' | 'operations' | 'esg'>('identity');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [selectedCert, setSelectedCert] = useState<{ img: string; title: string; issuer: string } | null>(null);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [liveProducts, setLiveProducts] = useState<any[]>(PRODUCTS);
  const [categories, setCategories] = useState<{ id: string; name: string; slug?: string }[]>([]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.content) setSiteContent(data.content);
      })
      .catch(() => {});

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products) && data.products.length > 0) {
          setLiveProducts(data.products);
        }
      })
      .catch(() => {});

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Estimator State
  const [estProduct, setEstProduct] = useState('baskets');
  const [estQty, setEstQty] = useState(500);

  // RFQ Form State
  const [rfqSubmitting, setRfqSubmitting] = useState(false);
  const [rfqResult, setRfqResult] = useState<{ success: boolean; ref: string } | null>(null);
  const [rfqFormData, setRfqFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Handwoven Kaisa Grass Storage Baskets',
    destination: '',
    quantity: '500 pcs',
    incoterm: 'FOB Chittagong (BDCGP)',
    notes: ''
  });

  // Estimator Calculations
  const getEstimates = () => {
    let weightPerUnit = 2.2;
    let cbmPerUnit = 0.0055;
    let pcsPerCarton = 10;

    if (estProduct === 'rugs') {
      weightPerUnit = 2.2; cbmPerUnit = 0.0055; pcsPerCarton = 10;
    } else if (estProduct === 'baskets') {
      weightPerUnit = 1.8; cbmPerUnit = 0.0075; pcsPerCarton = 6;
    } else if (estProduct === 'tableware') {
      weightPerUnit = 0.35; cbmPerUnit = 0.0008; pcsPerCarton = 40;
    } else if (estProduct === 'bags') {
      weightPerUnit = 0.28; cbmPerUnit = 0.0007; pcsPerCarton = 100;
    }

    const totalWeight = Math.round(estQty * weightPerUnit);
    const totalCBM = (estQty * cbmPerUnit).toFixed(1);
    const totalCartons = Math.ceil(estQty / pcsPerCarton);

    let freightMode = 'LCL Sea Freight';
    const cbmNum = parseFloat(totalCBM);
    if (cbmNum > 28 && cbmNum <= 65) freightMode = "40' Standard FCL";
    else if (cbmNum > 15 && cbmNum <= 28) freightMode = "20' Standard FCL";
    else if (cbmNum > 65) freightMode = "40' High-Cube (HQ)";
    else if (estQty <= 150) freightMode = 'Air Express (DHL/FedEx)';

    return { totalWeight, totalCBM, totalCartons, freightMode };
  };

  const estimates = getEstimates();

  // Handle Global RFQ Submit
  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitting(true);
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rfqFormData)
      });
      const data = await res.json();
      if (data.success) {
        setRfqResult({ success: true, ref: data.reference });
      }
    } catch (err) {
      alert('Error submitting inquiry. Please contact us directly via WhatsApp.');
    } finally {
      setRfqSubmitting(false);
    }
  };

  const filteredProducts = catalogFilter === 'all' 
    ? liveProducts 
    : liveProducts.filter(p => (p.category && p.category.toLowerCase().includes(catalogFilter.toLowerCase())) || p.slug.includes(catalogFilter));

  return (
    <div className="font-sans antialiased text-stone-800 bg-linen-50 min-h-screen flex flex-col justify-between">
      
      <Navbar />

      {/* 3. HERO SECTION */}
      <section className="relative min-h-[720px] lg:min-h-[820px] hero-mesh flex items-center justify-center overflow-hidden border-b border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-obsidian-850 border border-obsidian-700 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-stone-200">
                  {siteContent?.hero?.badge || 'Direct Manufacturer & Exporter'} • <span className="text-amber-400">Northern Bengal, Bangladesh</span>
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                {siteContent?.hero?.headline || (
                  <>Weaving <span className="text-gradient-gold italic">Earth-Conscious</span> Luxury for Global Living.</>
                )}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-2xl">
                {siteContent?.hero?.subheading || (
                  <>We manufacture and export authentic <strong>Kaisa Grass Storage Baskets</strong>, <strong>Coiled Seagrass Hampers & Planters</strong>, <strong>Braided Golden Jute Bins</strong>, and <strong>Two-Tone Coiled Rope Organizers</strong>. Direct workshop pricing with custom specifications on each dedicated product page.</>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#collections" className="px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow transition">
                  {siteContent?.hero?.ctaCatalogText || 'Explore Products & Custom Quotes ↓'}
                </a>
                <Link href="/company-profile" className="px-6 py-4 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-stone-200 border border-obsidian-600 font-semibold text-xs uppercase tracking-wider transition">
                  📄 Company Profile Dossier
                </Link>
                <a href="https://wa.me/8801740305936" target="_blank" rel="noreferrer" className="px-5 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition">
                  💬 Live WhatsApp
                </a>
              </div>

              <div className="pt-8 border-t border-obsidian-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-extrabold text-white">{siteContent?.hero?.statArtisans || '500+'}</div>
                  <div className="text-xs text-stone-400 mt-1">{siteContent?.hero?.statArtisansLabel || 'Rural Female Artisans'}</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{siteContent?.hero?.statEco || '100%'}</div>
                  <div className="text-xs text-stone-400 mt-1">{siteContent?.hero?.statEcoLabel || 'Biodegradable Fibers'}</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{siteContent?.hero?.statExperience || '15K+'}</div>
                  <div className="text-xs text-stone-400 mt-1">{siteContent?.hero?.statExperienceLabel || 'Monthly Unit Capacity'}</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{siteContent?.hero?.statCountries || 'FOB/CIF'}</div>
                  <div className="text-xs text-stone-400 mt-1">{siteContent?.hero?.statCountriesLabel || 'Chittagong Port (BDCGP)'}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-obsidian-700 bg-obsidian-850 shadow-2xl p-3">
                <div className="relative h-[420px] rounded-2xl overflow-hidden group">
                  <img 
                    src="/assets/products/kaisa-grass-deep-baskets.jpg" 
                    alt="Authentic Handwoven Kaisa Grass Deep Storage Baskets" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 glass-dark rounded-xl px-3.5 py-2 border border-white/10 flex items-center gap-2.5">
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-wider">Govt. Exporter Registration</div>
                      <div className="text-xs font-mono font-bold text-amber-300">ERC: 260326211291422</div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-500/90 text-stone-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    Authentic Workshop Product
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-dark border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Featured Handcraft</span>
                        <h4 className="text-white font-bold text-sm sm:text-base">Kaisa Grass Deep Storage Baskets (Set of 3)</h4>
                      </div>
                      <Link 
                        href="/products/kaisa-grass-deep-storage-baskets"
                        className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase transition shadow shrink-0"
                      >
                        Custom Quote →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3B. OFFICIAL EXPORT COLLECTION BANNER SHOWCASE */}
      <section className="bg-obsidian-900 border-b border-obsidian-800 py-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-3/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-stone-900">
                <img 
                  src="/assets/products/export-banner-showcase.jpg" 
                  alt="North Bengal Handmade Products BD - Handcrafted Kaisa Grass Low Shelf Trays"
                  className="w-full h-auto max-h-[420px] object-cover hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
              <div className="w-full lg:w-2/5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
                  {siteContent?.exportBanner?.badge || 'Official Export Banner'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  {siteContent?.exportBanner?.headline || '"Ethically Handmade | Naturally Beautiful | Certified for Global Standards"'}
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed">
                  {siteContent?.exportBanner?.description || (
                    <><strong>Exporting Handmade Excellence Since 2011</strong> — From artisan hands in Northern Bengal directly to your global retail shelves. Sustainable baskets, totes, planters, and shelf organizers manufactured under ethical fair-trade conditions.</>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-obsidian-800/80 border border-obsidian-700">
                    <div className="text-amber-400 font-bold">{siteContent?.exportBanner?.tag1 || '100% Eco-Friendly'}</div>
                    <div className="text-stone-400 text-[11px] mt-0.5">Kaisa, Seagrass & Golden Jute</div>
                  </div>
                  <div className="p-3 rounded-xl bg-obsidian-800/80 border border-obsidian-700">
                    <div className="text-emerald-400 font-bold">{siteContent?.exportBanner?.tag2 || 'Wholesale Direct'}</div>
                    <div className="text-stone-400 text-[11px] mt-0.5">FOB Chittagong Sea Freight</div>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a 
                    href="#collections" 
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider transition shadow"
                  >
                    View Catalog Below ↓
                  </a>
                  <a 
                    href="https://wa.me/8801740305936?text=Hello%2C%20I%20saw%20your%20Export%20Collection%20banner%20and%20would%20like%20to%20request%20wholesale%20pricing." 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition shadow"
                  >
                    💬 WhatsApp Factory Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3C. INTERACTIVE ANIMATED PRODUCT SHOWCASE SLIDER (52 PRODUCTS STREAM) */}
      <ProductShowcaseSlider />

      {/* 4. HERITAGE SECTION */}
      <section id="heritage" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-200 bg-stone-100 group">
                <img 
                  src="/assets/products/cotton-rope-two-tone-baskets.jpg" 
                  alt="Handcrafted Two-Tone Natural Rope & Jute Storage Baskets" 
                  className="w-full h-[460px] object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-5 -right-3 sm:right-4 bg-obsidian-900 text-white p-4 rounded-2xl shadow-xl border border-obsidian-750 max-w-xs">
                <div className="text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Authentic Workshop Quality
                </div>
                <div className="text-xs font-bold text-white mt-1">Two-Tone Coiled Rope Storage Baskets</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Nesting set of 3 with integrated handles</div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-5">
              <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
                {siteContent?.heritage?.badge || 'Artisanal Roots'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
                {siteContent?.heritage?.title || "Northern Bengal's Legendary Weaving Craftsmanship"}
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                {siteContent?.heritage?.p1 || (
                  <>Founded in Northern Bangladesh, <strong>North Bengal Handmade Products BD</strong> represents the perfect union between ancient weaving ingenuity and modern global supply-chain excellence.</>
                )}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                {siteContent?.heritage?.p2 || (
                  <>Northern Bengal—particularly <strong>Kaunia, Rangpur</strong>—has been revered for generations as the center of artisanal fiber weaving, where master women weavers hand-manipulate raw golden jute, kaisa grass, and soft cotton into heirloom home baskets and storage organizers. By structuring these decentralized cottage artisans into an export-ready production ecosystem managed from our corporate liaison headquarters in <strong>Sector-06, Uttara, Dhaka</strong>, we deliver pristine handcrafted goods directly to global retailers.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 360 COMPANY PROFILE DASHBOARD */}
      <section id="profile-section" className="py-24 bg-obsidian-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              Executive Corporate Profile
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-4 tracking-tight">
              Corporate Profile & Governance
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <button 
                onClick={() => setProfileTab('identity')} 
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${profileTab === 'identity' ? 'bg-amber-400 text-stone-950' : 'bg-obsidian-800 text-stone-300'}`}
              >
                1. Statutory Identity
              </button>
              <button 
                onClick={() => setProfileTab('leadership')} 
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${profileTab === 'leadership' ? 'bg-amber-400 text-stone-950' : 'bg-obsidian-800 text-stone-300'}`}
              >
                2. Key Leadership
              </button>
              <button 
                onClick={() => setProfileTab('operations')} 
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${profileTab === 'operations' ? 'bg-amber-400 text-stone-950' : 'bg-obsidian-800 text-stone-300'}`}
              >
                3. Dual Hubs
              </button>
              <button 
                onClick={() => setProfileTab('esg')} 
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${profileTab === 'esg' ? 'bg-amber-400 text-stone-950' : 'bg-obsidian-800 text-stone-300'}`}
              >
                4. UN SDGs & ESG
              </button>
            </div>
          </div>

          {profileTab === 'identity' && (
            <div className="bg-obsidian-850 rounded-3xl p-8 border border-obsidian-700 shadow-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <tbody className="divide-y divide-obsidian-750">
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium w-2/5">Entity Name</td>
                    <td className="py-3.5 font-bold text-white text-sm">North Bengal Handmade Products BD</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium">Alternative Registered Name</td>
                    <td className="py-3.5 text-stone-200">M/s. North Bangal Handmade Products BD</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium">Export Registration Certificate (ERC)</td>
                    <td className="py-3.5 font-mono font-bold text-amber-300 text-sm">260326211291422</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium">VAT / BIN Registration (Mushak-2.3)</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-300 text-sm">004681231-0102</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium">Taxpayer Identification Number (e-TIN)</td>
                    <td className="py-3.5 font-mono font-bold text-blue-300 text-sm">465746253246</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium">Trade License Number</td>
                    <td className="py-3.5 font-mono font-bold text-purple-300 text-sm">No. 147 (Kaunia, Rangpur)</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 text-stone-400 font-medium">Nominated Bank & Branch</td>
                    <td className="py-3.5 text-stone-200 font-semibold">Agrani Bank Ltd., Gazipur Corporate Branch</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {profileTab === 'leadership' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-obsidian-850 rounded-3xl p-8 border border-obsidian-700">
                <div className="text-xl font-bold text-white">Md. Mostaq Ahmed</div>
                <div className="text-xs uppercase text-amber-400 font-semibold mt-0.5">Proprietor / Partner (Kaunia, Rangpur)</div>
                <p className="text-xs text-stone-300 mt-4 leading-relaxed">
                  Head of artisan operations, horizontal pit-loom production, and traditional dye house operations in Kaunia, Rangpur. Oversees more than 500 weavers across Northern Bengal.
                </p>
              </div>

              <div className="bg-obsidian-850 rounded-3xl p-8 border border-obsidian-700">
                <div className="text-xl font-bold text-white">Md. Abdullah Al Mamun</div>
                <div className="text-xs uppercase text-emerald-400 font-semibold mt-0.5">Proprietor / Partner (Uttara, Dhaka)</div>
                <p className="text-xs text-stone-300 mt-4 leading-relaxed">
                  Head of global commercial export accounts, letters of credit management, and seaport freight forwarder logistics from the Dhaka Liaison Desk.
                </p>
              </div>
            </div>
          )}

          {profileTab === 'operations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-obsidian-850 rounded-3xl p-8 border border-obsidian-700">
                <h4 className="text-xl font-bold text-white mb-2">Corporate & Export Desk (Dhaka)</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230, Bangladesh.<br/>
                  Primary point for buyer contract signing, express counter-sample dispatch, and bank L/C management.
                </p>
              </div>

              <div className="bg-obsidian-850 rounded-3xl p-8 border border-obsidian-700">
                <h4 className="text-xl font-bold text-white mb-2">Artisan Production Hub (Rangpur)</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Sarhi, Shahidbagh Union, Kaunia Upazila, Rangpur District, Bangladesh.<br/>
                  Houses wooden horizontal pit-looms, raw jute spinning yards, and export packaging facilities.
                </p>
              </div>
            </div>
          )}

          {profileTab === 'esg' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-obsidian-850 border border-obsidian-700">
                <div className="text-2xl font-black text-amber-400 mb-1">SDG 1</div>
                <div className="font-bold text-white text-sm">No Poverty</div>
                <p className="text-xs text-stone-400 mt-2">{siteContent?.esg?.sdg1 || 'Steady fair wages directly paid to rural Northern Bengal craft households.'}</p>
              </div>
              <div className="p-6 rounded-3xl bg-obsidian-850 border border-obsidian-700">
                <div className="text-2xl font-black text-emerald-400 mb-1">SDG 5</div>
                <div className="font-bold text-white text-sm">Gender Equality</div>
                <p className="text-xs text-stone-400 mt-2">{siteContent?.esg?.sdg5 || 'Empowering 85%+ rural female artisans with leadership and financial independence.'}</p>
              </div>
              <div className="p-6 rounded-3xl bg-obsidian-850 border border-obsidian-700">
                <div className="text-2xl font-black text-blue-400 mb-1">SDG 12</div>
                <div className="font-bold text-white text-sm">Responsible Consumption</div>
                <p className="text-xs text-stone-400 mt-2">{siteContent?.esg?.sdg12 || '100% biodegradable natural fibers replacing petroleum synthetics.'}</p>
              </div>
              <div className="p-6 rounded-3xl bg-obsidian-850 border border-obsidian-700">
                <div className="text-2xl font-black text-purple-400 mb-1">SDG 13</div>
                <div className="font-bold text-white text-sm">Climate Action</div>
                <p className="text-xs text-stone-400 mt-2">{siteContent?.esg?.sdg13 || 'Carbon-negative golden jute handloomed without industrial emissions.'}</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 6. INDIVIDUAL PRODUCT CARDS GRID (NO CART - DIRECT TO INDIVIDUAL PAGE) */}
      <section id="collections" className="py-24 bg-linen-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-amber-800 text-xs font-bold uppercase tracking-widest bg-amber-200/80 px-3.5 py-1 rounded-full">
              Export Product Catalog
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 mt-4">
              Artisanal Home & Living Collections
            </h2>
            <p className="text-stone-600 mt-2 text-sm">
              Each product features a dedicated page for technical specifications, custom dimensions, color choices, and custom quote requisitions.
            </p>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'all', label: `All Collections (${liveProducts.length})` },
                ...(categories.length > 0
                  ? categories.map(c => ({ id: c.slug || c.id, label: c.name }))
                  : [
                      { id: 'kaisa', label: 'Kaisa Grass Baskets & Trays' },
                      { id: 'seagrass', label: 'Seagrass Hampers & Bowls' },
                      { id: 'jute', label: 'Golden Jute Planters' },
                      { id: 'rope', label: 'Cotton Rope Baskets' },
                      { id: 'tote', label: 'Market Totes' }
                    ]
                )
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCatalogFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${catalogFilter === cat.id ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(p => (
              <div key={p.slug} className="bg-white rounded-3xl overflow-hidden shadow-soft-card border border-stone-200 hover:shadow-2xl transition duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative h-64 overflow-hidden bg-stone-100 flex items-center justify-center">
                    <img 
                      src={p.heroImage || p.image || (p.images && p.images[0]) || p.thumb || '/assets/products/kaisa-grass-deep-baskets.jpg'} 
                      alt={p.title} 
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('kaisa-grass-deep-baskets')) {
                          target.src = '/assets/products/kaisa-grass-deep-baskets.jpg';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {p.badge || 'Export Grade'}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">{p.category}</div>
                    <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition">{p.title}</h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2">{p.description || `${p.title} handcrafted in Northern Bengal using premium natural fibers.`}</p>
                    <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-mono">
                      <span>MOQ: <strong className="text-stone-900">{p.specs?.moq ? p.specs.moq.split(' ')[0] : (p.moq ? p.moq.split(' ')[0] : '500')} pcs</strong></span> • <span>Lead Time: <strong className="text-stone-900">{p.specs?.productionLeadTime ? p.specs.productionLeadTime.split('for')[0] : (p.leadTime ? p.leadTime.split('for')[0] : '25-35 Days')}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <Link 
                    href={`/products/${p.slug}`}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition text-center block shadow"
                  >
                    View Product & Custom Quote →
                  </Link>
                  <a 
                    href={`https://wa.me/8801740305936?text=${encodeURIComponent(`Hello North Bengal Handmade, I would like to request a custom quote for: ${p.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider transition text-center block"
                  >
                    💬 Quick WhatsApp Quote
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. GOVERNMENT CERTIFICATIONS GALLERY */}
      <section id="credentials" className="py-24 bg-white border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
              Legal Compliance & Verification
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
              Government Recognized Exporter
            </h2>
            <p className="text-stone-600 mt-2 text-sm">
              Click any certificate to inspect the high-resolution official document issued by the authorities of Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => setSelectedCert({ img: '/assets/certificates/erc-certificate.png', title: 'Export Registration Certificate (ERC)', issuer: 'Office of Chief Controller of Imports & Exports' })}
              className="p-6 bg-linen-50 border border-stone-200 rounded-3xl hover:shadow-xl hover:border-amber-400 transition cursor-pointer flex flex-col justify-between items-center text-center group"
            >
              <div className="w-full flex flex-col items-center">
                <div className="h-56 w-full flex items-center justify-center bg-white rounded-2xl border border-stone-200 p-3 mb-4 shadow-sm group-hover:scale-[1.02] transition-transform">
                  <img src="/assets/certificates/erc-certificate.png" alt="ERC Certificate" className="h-full w-auto object-contain mx-auto"/>
                </div>
                <div className="text-sm font-bold text-stone-900 text-center">Export Registration (ERC)</div>
                <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-amber-500/10 font-mono text-xs text-amber-900 font-bold text-center border border-amber-500/20">
                  260326211291422
                </div>
              </div>
              <div className="text-[11px] text-stone-500 mt-4 text-center w-full flex items-center justify-center gap-1.5 font-medium group-hover:text-amber-800 transition-colors">
                <span>🔍 Click to inspect original</span>
              </div>
            </div>

            <div 
              onClick={() => setSelectedCert({ img: '/assets/certificates/vat-certificate.png', title: 'VAT Registration Certificate (Mushak-2.3)', issuer: 'Customs, Excise & VAT Commissionerate, Dhaka North' })}
              className="p-6 bg-linen-50 border border-stone-200 rounded-3xl hover:shadow-xl hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between items-center text-center group"
            >
              <div className="w-full flex flex-col items-center">
                <div className="h-56 w-full flex items-center justify-center bg-white rounded-2xl border border-stone-200 p-3 mb-4 shadow-sm group-hover:scale-[1.02] transition-transform">
                  <img src="/assets/certificates/vat-certificate.png" alt="VAT Certificate" className="h-full w-auto object-contain mx-auto"/>
                </div>
                <div className="text-sm font-bold text-stone-900 text-center">VAT / BIN Registration</div>
                <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-emerald-500/10 font-mono text-xs text-emerald-900 font-bold text-center border border-emerald-500/20">
                  004681231-0102
                </div>
              </div>
              <div className="text-[11px] text-stone-500 mt-4 text-center w-full flex items-center justify-center gap-1.5 font-medium group-hover:text-emerald-800 transition-colors">
                <span>🔍 Click to inspect original</span>
              </div>
            </div>

            <div 
              onClick={() => setSelectedCert({ img: '/assets/certificates/tin-certificate.png', title: 'Taxpayer Identification Number (e-TIN)', issuer: 'Taxes Circle-190, Taxes Zone 09, Dhaka' })}
              className="p-6 bg-linen-50 border border-stone-200 rounded-3xl hover:shadow-xl hover:border-blue-400 transition cursor-pointer flex flex-col justify-between items-center text-center group"
            >
              <div className="w-full flex flex-col items-center">
                <div className="h-56 w-full flex items-center justify-center bg-white rounded-2xl border border-stone-200 p-3 mb-4 shadow-sm group-hover:scale-[1.02] transition-transform">
                  <img src="/assets/certificates/tin-certificate.png" alt="TIN Certificate" className="h-full w-auto object-contain mx-auto"/>
                </div>
                <div className="text-sm font-bold text-stone-900 text-center">Taxpayer ID (e-TIN)</div>
                <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-blue-500/10 font-mono text-xs text-blue-900 font-bold text-center border border-blue-500/20">
                  465746253246
                </div>
              </div>
              <div className="text-[11px] text-stone-500 mt-4 text-center w-full flex items-center justify-center gap-1.5 font-medium group-hover:text-blue-800 transition-colors">
                <span>🔍 Click to inspect original</span>
              </div>
            </div>

            <div 
              onClick={() => setSelectedCert({ img: '/assets/certificates/trade-license.jpg', title: 'Local Government Trade License', issuer: 'Shahidbagh Union Parishad, Kaunia, Rangpur' })}
              className="p-6 bg-linen-50 border border-stone-200 rounded-3xl hover:shadow-xl hover:border-purple-400 transition cursor-pointer flex flex-col justify-between items-center text-center group"
            >
              <div className="w-full flex flex-col items-center">
                <div className="h-56 w-full flex items-center justify-center bg-white rounded-2xl border border-stone-200 p-3 mb-4 shadow-sm group-hover:scale-[1.02] transition-transform">
                  <img src="/assets/certificates/trade-license.jpg" alt="Trade License" className="h-full w-auto object-contain mx-auto"/>
                </div>
                <div className="text-sm font-bold text-stone-900 text-center">Trade License (Rangpur)</div>
                <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-purple-500/10 font-mono text-xs text-purple-900 font-bold text-center border border-purple-500/20">
                  License No: 147
                </div>
              </div>
              <div className="text-[11px] text-stone-500 mt-4 text-center w-full flex items-center justify-center gap-1.5 font-medium group-hover:text-purple-800 transition-colors">
                <span>🔍 Click to inspect original</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. B2B CONTAINER ESTIMATOR */}
      <section id="estimator" className="py-24 bg-obsidian-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Smart Logistics Tool</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">B2B Container & Volume Estimator</h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Compute estimated cargo volume in CBM, shipment weight, and recommended ocean freight mode for your consignment from Bangladesh.
              </p>
            </div>

            <div className="lg:col-span-7 bg-obsidian-850 p-8 rounded-3xl border border-obsidian-700">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Select Product Type</label>
                  <select 
                    value={estProduct} 
                    onChange={e => setEstProduct(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-700 text-white"
                  >
                    <option value="baskets">Handwoven Storage Baskets (Sets of 3)</option>
                    <option value="rope">Two-Tone Cotton Rope Baskets</option>
                    <option value="tableware">Shelf Organizer Trays</option>
                    <option value="bags">Seagrass & Jute Market Totes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase mb-1">Quantity: <span className="text-amber-400 font-mono">{estQty} pcs</span></label>
                  <input 
                    type="range" 
                    min={50} 
                    max={10000} 
                    step={50} 
                    value={estQty} 
                    onChange={e => setEstQty(Number(e.target.value))} 
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-obsidian-900 rounded-2xl text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Est. Volume</div>
                    <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">{estimates.totalCBM} CBM</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Gross Weight</div>
                    <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">{estimates.totalWeight} kg</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Master Cartons</div>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">{estimates.totalCartons} Boxes</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Best Freight</div>
                    <div className="text-xs font-bold text-amber-400 mt-1">{estimates.freightMode}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. GLOBAL RFQ INQUIRY FORM */}
      <section id="rfq-studio" className="py-24 bg-linen-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-stone-900 text-xs font-bold uppercase tracking-wider bg-amber-200 px-3 py-1 rounded">General Requisitions</span>
              <h2 className="text-3xl font-extrabold text-stone-900">Request Commercial Catalog & Quote</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect directly with our export desk. We offer FOB Chittagong, CFR, and CIF pricing with rapid 7–10 day counter-sampling.
              </p>
              
              <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-lg">
                <div className="text-xs uppercase font-bold text-emerald-200">Urgent Inquiries</div>
                <div className="text-xl font-bold font-mono mt-1">+880 1740-305936</div>
                <div className="text-xs text-emerald-100 mt-0.5">WhatsApp desk live 6 days a week</div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xl">
              <form onSubmit={handleRfqSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={rfqFormData.name} 
                      onChange={e => setRfqFormData({ ...rfqFormData, name: e.target.value })} 
                      placeholder="e.g. Sarah Jenkins" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Company / Brand *</label>
                    <input 
                      type="text" 
                      required 
                      value={rfqFormData.company} 
                      onChange={e => setRfqFormData({ ...rfqFormData, company: e.target.value })} 
                      placeholder="e.g. Nordic Craft Living" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Business Email *</label>
                    <input 
                      type="email" 
                      required 
                      value={rfqFormData.email} 
                      onChange={e => setRfqFormData({ ...rfqFormData, email: e.target.value })} 
                      placeholder="buyer@brand.com" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      required 
                      value={rfqFormData.phone} 
                      onChange={e => setRfqFormData({ ...rfqFormData, phone: e.target.value })} 
                      placeholder="+1 555 123 4567" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Destination Seaport / Airport *</label>
                    <input 
                      type="text" 
                      required 
                      value={rfqFormData.destination} 
                      onChange={e => setRfqFormData({ ...rfqFormData, destination: e.target.value })} 
                      placeholder="e.g. Port of Hamburg / Los Angeles" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Estimated Quantity</label>
                    <input 
                      type="text" 
                      value={rfqFormData.quantity} 
                      onChange={e => setRfqFormData({ ...rfqFormData, quantity: e.target.value })} 
                      placeholder="e.g. 500 pcs or Sample Run" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Order Details / Specifications</label>
                  <textarea 
                    rows={3} 
                    value={rfqFormData.notes} 
                    onChange={e => setRfqFormData({ ...rfqFormData, notes: e.target.value })} 
                    placeholder="Specify custom sizing, Pantone shades, barcodes, or custom branding..." 
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={rfqSubmitting}
                  className="w-full py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  {rfqSubmitting ? 'Transmitting to Server...' : 'Dispatch Requisition to Export Desk →'}
                </button>
              </form>

              {rfqResult && (
                <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs">
                  <div className="font-bold text-sm mb-1">Requisition Successfully Registered!</div>
                  <div>Official Reference: <strong className="font-mono text-sm">{rfqResult.ref}</strong></div>
                  <p className="mt-1">Our commercial sales officer will review your specs and email your proforma quote within 12 business hours.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 10. DUAL FACILITIES & CONTACT */}
      <section id="contact-hub" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-stone-900">Our Facilities & Contact Desk</h2>
            <p className="text-stone-600 mt-2 text-sm">International buyers and inspection agencies are warmly welcome to visit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-linen-100 border border-stone-200">
              <span className="text-xs font-bold text-amber-800 uppercase">Dhaka Corporate HQ</span>
              <h3 className="text-xl font-bold text-stone-900 mt-1 mb-3">Export Liaison Office</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230, Bangladesh.<br/>
                Phone: +880 1740-305936<br/>
                Email: export@northbengalhandmade.com
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-linen-100 border border-stone-200">
              <span className="text-xs font-bold text-emerald-800 uppercase">Rangpur Craft Center</span>
              <h3 className="text-xl font-bold text-stone-900 mt-1 mb-3">Kaunia Handloom Center</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sarhi, Shahidbagh Union, Kaunia Upazila, Rangpur District, Bangladesh.<br/>
                Trade License No: 147 (Kaunia)<br/>
                Operations Lead: Md. Mostaq Ahmed & Md. Abdullah Al Mamun
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 11. FOOTER */}
      <Footer />

      {/* MODAL: CERTIFICATE ZOOM */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedCert(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-stone-900 text-base">{selectedCert.title}</h4>
                <div className="text-xs text-stone-500">{selectedCert.issuer}</div>
              </div>
              <button onClick={() => setSelectedCert(null)} className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                ✕
              </button>
            </div>
            <div className="flex justify-center bg-stone-100 p-4 rounded-2xl max-h-[75vh] overflow-auto">
              <img src={selectedCert.img} alt={selectedCert.title} className="max-h-[70vh] object-contain rounded shadow"/>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
