'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ALL_PRODUCTS, ProductItem } from '@/lib/allProductsData';

export default function ProductShowcaseSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>(ALL_PRODUCTS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(() => {});
  }, []);

  // Filter featured or first 24 products for the dynamic showcase slider
  const featured = productsList.filter(p => p.featured);
  const sliderItems = featured.length >= 8 ? featured : productsList.slice(0, 24);

  // Manual scroll handler
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-stone-900 text-white relative overflow-hidden border-y border-obsidian-800">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Live Export Showcase (52 Products)
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Handcrafted Product <span className="text-gradient-gold">Visual Showcase</span>
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
              Continuous export catalog stream of authentic Kaunia seagrass, golden jute, and organic cotton designs. Hover to pause, click to inspect specs or request a custom container quote.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold uppercase tracking-wider transition"
            >
              View All 52 In Gallery →
            </Link>
            
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-white flex items-center justify-center font-bold text-sm transition"
              aria-label="Previous Product"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-white flex items-center justify-center font-bold text-sm transition"
              aria-label="Next Product"
            >
              →
            </button>
          </div>
        </div>

        {/* CONTINUOUS SMOOTH SLIDING STRIP */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sliderItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[300px] sm:w-[340px] shrink-0 snap-start bg-obsidian-850 rounded-3xl border border-obsidian-700/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-400/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Studio Contrast & Framing */}
                <div 
                  onClick={() => setSelectedProduct(item)}
                  className="aspect-square w-full bg-stone-950 p-4 relative overflow-hidden flex items-center justify-center cursor-pointer group/img"
                >
                  <img
                    src={item.image || item.heroImage || (item.images && item.images[0]) || item.thumb || '/assets/products/kaisa-grass-deep-baskets.jpg'}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('kaisa-grass-deep-baskets')) {
                        target.src = '/assets/products/kaisa-grass-deep-baskets.jpg';
                      }
                    }}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-110 drop-shadow-lg"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-obsidian-900/90 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-500/20">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-stone-900/80 text-stone-300 text-[10px] font-mono font-bold">
                    {item.itemNo}
                  </div>

                  {/* Hover Quick Zoom Pill */}
                  <div className="absolute inset-0 bg-obsidian-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-stone-950 text-xs font-bold uppercase shadow-lg">
                      🔍 Quick Inspect
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
                    {item.material}
                  </div>
                  <h3 className="font-bold text-white text-base mt-1 line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-xs text-stone-400 border-t border-obsidian-700 pt-2.5">
                    <span>MOQ: <strong className="text-stone-200">{item.moq}</strong></span>
                    <span className="text-emerald-400 font-medium">Export Ready</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => setSelectedProduct(item)}
                  className="w-1/2 py-2 rounded-xl border border-obsidian-700 hover:border-stone-500 text-stone-300 hover:text-white text-xs font-semibold transition text-center"
                >
                  Specs
                </button>
                <Link
                  href={`/contact?product=${encodeURIComponent(item.title)}&code=${encodeURIComponent(item.itemNo)}`}
                  className="w-1/2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider transition text-center flex items-center justify-center"
                >
                  Quote RFQ
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* BOTTOM QUICK NAV LINK */}
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <span>Browse the complete 52-product catalog with high-resolution inspection & filters</span>
            <span>→</span>
          </Link>
        </div>

      </div>

      {/* QUICK MODAL PREVIEW */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto text-stone-900">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-950 text-white flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-stone-100 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="max-h-[380px] w-auto object-contain drop-shadow-md rounded-xl"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mt-2">
                    {selectedProduct.title}
                  </h3>
                  <div className="mt-4 space-y-2 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div><strong>Code:</strong> {selectedProduct.itemNo}</div>
                    <div><strong>Material:</strong> {selectedProduct.material}</div>
                    <div><strong>Design:</strong> {selectedProduct.structure}</div>
                    <div><strong>MOQ:</strong> {selectedProduct.moq}</div>
                    <div><strong>Lead Time:</strong> {selectedProduct.leadTime}</div>
                    <div><strong>Port:</strong> FOB Chittagong (BDCGP)</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={`/contact?product=${encodeURIComponent(selectedProduct.title)}&code=${encodeURIComponent(selectedProduct.itemNo)}`}
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase text-center shadow transition"
                  >
                    Request Custom Quote for This Item →
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs text-center transition"
                  >
                    View in Full 52 Products Gallery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
