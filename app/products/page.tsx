'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/products';

export default function ProductsCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveProducts, setLiveProducts] = useState(PRODUCTS);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug?: string }[]>([]);

  useEffect(() => {
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
          setDbCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: `All Products (${liveProducts.length})` },
    ...(dbCategories.length > 0
      ? dbCategories.map(c => ({ id: c.slug || c.id, label: c.name }))
      : [
          { id: 'kaisa', label: 'Kaisa Grass Baskets & Trays' },
          { id: 'seagrass', label: 'Seagrass Hampers & Bowls' },
          { id: 'jute', label: 'Golden Jute Planters' },
          { id: 'rope', label: 'Cotton Rope Baskets' },
          { id: 'tote', label: 'Seagrass Market Totes' }
        ]
    )
  ];

  const filteredProducts = liveProducts.filter(p => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      p.slug.includes(selectedCategory) || 
      (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    const matchesSearch = 
      searchQuery === '' ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.specs?.material && p.specs.material.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linen-50 text-stone-800 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        {/* HERO BANNER */}
        <section className="bg-obsidian-950 text-white py-16 sm:py-20 border-b border-obsidian-850 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold uppercase tracking-widest mb-4">
                Factory Direct Catalog
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Authentic Export <span className="text-gradient-gold">Handicrafts</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-4 leading-relaxed font-light">
                Discover our workshop-manufactured natural home organizers, planters, storage hampers, and lifestyle totes. Click on any product to open its <strong>dedicated technical specification page</strong> and request an itemized commercial quote.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  <span>✨ Browse All 52 Handcrafted Products in Gallery</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTROLS & FILTERS */}
        <section className="bg-white border-b border-stone-200 py-6 sticky top-20 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-stone-900 text-white shadow'
                        : 'bg-linen-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-72 relative">
                <input
                  type="text"
                  placeholder="Search products, materials..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-linen-50 text-xs focus:outline-none focus:border-amber-500 pr-8"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="py-16 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
              <span>Showing <strong>{filteredProducts.length}</strong> export products</span>
              <span>Incoterm: <strong>FOB Chittagong Seaport (BDCGP)</strong></span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-stone-900">No products match your search</h3>
                <p className="text-xs text-stone-500 mt-1">Try clearing your filters or search keywords.</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="mt-4 px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(p => (
                  <div 
                    key={p.slug}
                    className="bg-white rounded-3xl overflow-hidden shadow-soft-card border border-stone-200 hover:shadow-2xl transition duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden bg-stone-100 flex items-center justify-center">
                        <img 
                          src={p.heroImage} 
                          alt={p.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          {p.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                          {p.category}
                        </div>
                        <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition">
                          {p.title}
                        </h3>
                        <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                          <div>
                            <span>MOQ: </span>
                            <strong className="text-stone-900">{p.specs?.moq ? p.specs.moq.split(' ')[0] : '500'} units</strong>
                          </div>
                          <div>
                            <span>Lead Time: </span>
                            <strong className="text-stone-900">{p.specs?.productionLeadTime ? p.specs.productionLeadTime.split('for')[0] : '25-35 Days'}</strong>
                          </div>
                          <div className="col-span-2 text-[10px] text-stone-400 font-mono">
                            Material: {p.specs?.material ? p.specs.material.split('with')[0] : 'Natural Plant Fiber'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Action Buttons (Individual Page Requisition) */}
                    <div className="p-6 pt-0 space-y-2">
                      <Link 
                        href={`/products/${p.slug}`}
                        className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition text-center block shadow"
                      >
                        View Details & Custom Quote →
                      </Link>
                      <a 
                        href={`https://wa.me/8801740305936?text=${encodeURIComponent(`Hello North Bengal Handmade, I would like to request an export quote for: ${p.title}`)}`}
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
            )}

          </div>
        </section>

        {/* CUSTOM OEM / ODM TECH-PACK BANNER */}
        <section className="bg-obsidian-900 py-16 border-t border-obsidian-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-obsidian-950 via-obsidian-850 to-obsidian-950 border border-amber-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Custom Engineering & Private Labeling
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Have a Custom Design or Tech-Pack?
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  We manufacture bespoke sizes, Pantone-matched custom dyes, branded faux leather patches, laser-engraved wooden tags, and retailer-ready barcode packaging. Send your technical drawings for rapid prototyping.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link 
                  href="/contact" 
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg text-center"
                >
                  Submit Tech-Pack Inquiry →
                </Link>
                <Link 
                  href="/company-profile" 
                  className="px-5 py-3.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-stone-200 border border-obsidian-700 font-semibold text-xs uppercase tracking-wider transition text-center"
                >
                  Corporate Dossier
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
