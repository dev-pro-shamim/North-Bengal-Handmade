'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ALL_PRODUCTS, ProductItem } from '@/lib/allProductsData';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);

  const categories = useMemo(() => {
    const cats = ['All'];
    ALL_PRODUCTS.forEach(p => {
      if (!cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats;
  }, []);

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        product.title.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.itemNo.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-obsidian-950 text-white py-16 sm:py-20 border-b border-obsidian-850 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-widest mb-4">
                ✨ 52 High-Quality Export Products
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Authentic Artisan <span className="text-amber-400">Product Gallery</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-4 leading-relaxed font-light">
                Explore our full line of 52 handcrafted natural fiber creations. Every single piece is handmade by master rural women artisans in Kaunia, Rangpur using 100% sustainable wild river seagrass, organic golden jute, and braided cotton rope.
              </p>
            </div>
          </div>
        </section>

        {/* CONTROLS & FILTER BAR */}
        <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-4 shadow-sm">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const count = cat === 'All' ? ALL_PRODUCTS.length : ALL_PRODUCTS.filter(p => p.category === cat).length;
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold scale-105'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 border border-stone-200/80'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search Field */}
              <div className="relative w-full md:w-80 shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by fiber, category, or code..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-stone-100 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
                <span className="absolute left-3 top-2.5 text-stone-400 text-sm">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* 52 PRODUCTS GRID */}
        <section className="py-12 sm:py-16">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-stone-500 font-medium">
                Showing <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> export products
              </div>
              <div className="text-xs text-amber-700 font-bold flex items-center gap-1.5">
                <span>🌟 Studio High-Contrast Inspection Enabled</span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-sm max-w-xl mx-auto my-12">
                <div className="text-4xl mb-4">🧺</div>
                <h3 className="text-xl font-bold text-stone-800">No matching products found</h3>
                <p className="text-stone-500 text-sm mt-2">Try adjusting your filter category or searching for terms like "Jute", "Seagrass", or "Hamper".</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Image Frame with Clean Background & Zoom Trigger */}
                      <div 
                        onClick={() => setActiveModalProduct(product)}
                        className="relative aspect-square w-full bg-stone-100 overflow-hidden cursor-pointer flex items-center justify-center p-3 border-b border-stone-100 group/img"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-108 group-hover:drop-shadow-md"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-obsidian-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider shadow">
                            🔍 Inspect High-Res
                          </span>
                        </div>

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                          {product.category}
                        </div>

                        {/* Item Code Badge */}
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-amber-500/90 text-stone-950 text-[10px] font-mono font-bold">
                          {product.itemNo}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5">
                        <div className="text-[11px] font-semibold text-amber-700 tracking-wide uppercase">
                          {product.material}
                        </div>
                        <h3 className="font-bold text-stone-900 text-base mt-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {product.title}
                        </h3>

                        <div className="mt-3.5 space-y-1.5 text-xs text-stone-500 border-t border-stone-100 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-stone-400">Export MOQ:</span>
                            <span className="font-semibold text-stone-700">{product.moq}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-400">FOB Term:</span>
                            <span className="font-semibold text-stone-700">Chittagong (BDCGP)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-400">Inspection:</span>
                            <span className="font-semibold text-emerald-600">Phytosanitary OK</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Requisition Buttons (NO ADD TO CART - CUSTOM QUOTE ONLY) */}
                    <div className="p-5 pt-0 mt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setActiveModalProduct(product)}
                        className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold tracking-wider transition text-center"
                      >
                        Inspect Specs
                      </button>

                      <Link
                        href={`/contact?product=${encodeURIComponent(product.title)}&code=${encodeURIComponent(product.itemNo)}`}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider transition shadow text-center flex items-center justify-center gap-1"
                      >
                        <span>Quote RFQ →</span>
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* EXPORT COMPLIANCE BANNER */}
        <section className="bg-obsidian-900 text-white py-14 border-t border-obsidian-800">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                  Bulk Buyer Support
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  Need Custom Sizes, Brand Hangtags, or Barcodes?
                </h3>
                <p className="text-stone-300 text-sm mt-2 max-w-2xl">
                  We specialize in OEM contract manufacturing for home décor importers across the USA, UK, Germany, and Australia. Custom dimensions and private labeling available with 100% compliance.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg transition"
                >
                  Request Master Container Quote
                </Link>
                <Link
                  href="/export-guide"
                  className="px-6 py-3.5 rounded-xl border border-stone-600 hover:border-amber-400 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  View Export Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* DETAIL INSPECTION MODAL */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-900/70 hover:bg-stone-950 text-white flex items-center justify-center text-lg font-bold transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* High-Resolution Zoom Display */}
              <div className="bg-stone-100 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200 relative">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.title}
                  className="max-h-[460px] w-auto object-contain rounded-xl drop-shadow-xl"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-stone-900/80 text-white text-[10px] font-bold">
                  {activeModalProduct.itemNo}
                </div>
              </div>

              {/* Product Specifications & RFQ Trigger */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {activeModalProduct.category}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    {activeModalProduct.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-2">
                    Crafted in Kaunia, Rangpur under master artisan supervision with zero industrial synthetic treatments.
                  </p>

                  <div className="mt-6 space-y-2.5 text-xs text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="font-semibold text-stone-500">Material Composition:</span>
                      <span className="font-bold text-stone-800">{activeModalProduct.material}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="font-semibold text-stone-500">Structural Shape:</span>
                      <span className="font-bold text-stone-800">{activeModalProduct.structure}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="font-semibold text-stone-500">Standard Export MOQ:</span>
                      <span className="font-bold text-amber-800">{activeModalProduct.moq}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="font-semibold text-stone-500">Lead Time:</span>
                      <span className="font-bold text-stone-800">{activeModalProduct.leadTime}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="font-semibold text-stone-500">Compliance & Health:</span>
                      <span className="font-bold text-emerald-700">{activeModalProduct.compliance}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-stone-500">Origin / Facility:</span>
                      <span className="font-bold text-stone-800">{activeModalProduct.origin}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col gap-2.5">
                  <Link
                    href={`/contact?product=${encodeURIComponent(activeModalProduct.title)}&code=${encodeURIComponent(activeModalProduct.itemNo)}`}
                    onClick={() => setActiveModalProduct(null)}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider text-center shadow-md transition"
                  >
                    Request Custom Export Quote for This Item →
                  </Link>
                  <p className="text-[11px] text-center text-stone-400">
                    Official quote response dispatched within 12 business hours by our Dhaka Export Desk.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
