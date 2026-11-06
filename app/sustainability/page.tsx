'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SustainabilityPage() {
  const processSteps = [
    {
      num: '01',
      title: 'Wild Harvesting & Sourcing',
      subtitle: 'Renewable River Reeds & Golden Jute',
      desc: 'Our wild kaisa grass and river seagrass are harvested sustainably from the riverine floodplains of the Teesta and Brahmaputra basins in Northern Bengal. Fast-growing wild grasses regenerate annually without requiring artificial irrigation, synthetic fertilizers, or pesticides.'
    },
    {
      num: '02',
      title: 'Sun-Drying & Fiber Grading',
      subtitle: 'Natural Solar Curing',
      desc: 'Freshly harvested reeds and tossa jute stalks undergo natural open-air solar curing in rural courtyards for 5 to 7 days. Artisans grade the dried fibers by tensile thickness, color tone, and moisture level, rejecting brittle or blemished strands.'
    },
    {
      num: '03',
      title: 'Artisan Coiling & Lock-Stitching',
      subtitle: 'Manual Master Craftsmanship',
      desc: 'Skilled women artisans tightly hand-coil the fibers around structural cores using high-strength invisible lock-stitching. The baskets achieve their structural rigidity entirely through tension and braiding without requiring metal wire frames or plastic skeletons.'
    },
    {
      num: '04',
      title: 'REACH-Compliant Azo-Free Dyeing',
      subtitle: 'Eco-Certified Botanical Colors',
      desc: 'When custom accent bands or colors are specified, we utilize eco-certified non-toxic dyes that comply with European Union REACH standards. The dyes are free of banned amines, formaldehyde, and heavy metals, rendering them safe for nursery toys and dining spaces.'
    },
    {
      num: '05',
      title: 'Digital Moisture Meter QC Testing',
      subtitle: '<12% Moisture Threshold Guarantee',
      desc: 'To prevent mildew during 30+ day ocean transit through humid tropical shipping lanes, every batch is inspected with calibrated digital moisture meters. Products are dried down to 10%–12% relative moisture content before packing.'
    },
    {
      num: '06',
      title: 'Nesting & Export Master Packaging',
      subtitle: 'CBM-Optimized Carton Palletization',
      desc: 'Sets are nested graduated 3-in-1 inside moisture-barrier poly sleeves with food-grade silica gel desiccants. Packed in 5-ply heavy-duty export master cartons engineered to withstand maritime pressure and maximize ocean container cube utilization.'
    }
  ];

  return (
    <div className="min-h-screen bg-linen-50 text-stone-800 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        {/* HERO BANNER */}
        <section className="bg-obsidian-950 text-white py-16 sm:py-20 border-b border-obsidian-850 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest mb-4">
                Circular Materials & Artisan Process
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Crafted by Nature. <span className="text-gradient-gold">Perfected by Hands.</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-4 leading-relaxed font-light">
                Discover the 100% biodegradable natural fibers of Northern Bangladesh, our 6-stage quality-controlled manufacturing journey, and our fair-trade commitment to 500+ rural women artisans.
              </p>
            </div>
          </div>
        </section>

        {/* 1. THE 4 NATURAL FIBERS */}
        <section className="py-20 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-emerald-800 text-xs font-bold uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
                Zero Plastic Policy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
                Our Sustainable Organic Raw Materials
              </h2>
              <p className="text-stone-600 mt-2 text-sm">
                We work exclusively with renewable, soil-compostable natural plant fibers harvested responsibly in Bangladesh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="p-6 rounded-3xl bg-linen-100 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl font-bold mb-4">
                    🌾
                  </div>
                  <h3 className="font-bold text-lg text-stone-900">Wild Kaisa Grass</h3>
                  <div className="text-[11px] font-bold text-amber-800 uppercase mt-1">Saccharum Spontaneum</div>
                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    A sturdy wild river grass that grows abundantly along the riverbanks of Northern Bengal. Extremely rigid when bound, water-resistant, and naturally blonde in color.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-stone-300 text-[11px] text-stone-500 font-medium">
                  Products: Deep Baskets & Shelf Trays
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-linen-100 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-200 text-emerald-900 flex items-center justify-center text-xl font-bold mb-4">
                    🌱
                  </div>
                  <h3 className="font-bold text-lg text-stone-900">Golden Tossa Jute</h3>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase mt-1">Corchorus Olitorius</div>
                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    Revered globally as the "Golden Fiber of Bengal". High tensile strength, acoustic dampening, naturally anti-static, and absorbs 15 tonnes of CO2 per hectare during growth.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-stone-300 text-[11px] text-stone-500 font-medium">
                  Products: Tapered Planters & Bins
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-linen-100 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-200 text-blue-900 flex items-center justify-center text-xl font-bold mb-4">
                    🌊
                  </div>
                  <h3 className="font-bold text-lg text-stone-900">Natural Seagrass</h3>
                  <div className="text-[11px] font-bold text-blue-800 uppercase mt-1">Sedge River Grasses</div>
                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    Flexible yet strong river grass gathered from aquatic wetlands. Features organic subtle green-to-beige tone shifts and smooth tactile surface resistant to fraying.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-stone-300 text-[11px] text-stone-500 font-medium">
                  Products: Cylindrical Hampers & Bowls
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-linen-100 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-200 text-purple-900 flex items-center justify-center text-xl font-bold mb-4">
                    ☁️
                  </div>
                  <h3 className="font-bold text-lg text-stone-900">Organic Cotton Cord</h3>
                  <div className="text-[11px] font-bold text-purple-800 uppercase mt-1">100% Natural Cotton Braids</div>
                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    Unbleached ecru cotton rope braided with precision density. Ultra-soft and pliable, scratch-free on fine furniture, and machine washable.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-stone-300 text-[11px] text-stone-500 font-medium">
                  Products: Two-Tone Coiled Baskets
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. THE 6-STAGE MANUFACTURING PROCESS */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-800 text-xs font-bold uppercase tracking-widest bg-amber-200/80 px-3.5 py-1 rounded-full">
                Factory Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
                The 6-Stage Manufacturing Journey
              </h2>
              <p className="text-stone-600 mt-2 text-sm">
                How raw Bangladeshi river grass transforms into export-ready luxury homeware.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map(step => (
                <div 
                  key={step.num}
                  className="bg-white rounded-3xl p-8 border border-stone-200 shadow-soft-card flex flex-col justify-between"
                >
                  <div>
                    <span className="text-4xl font-black text-amber-500/80 font-mono block mb-2">
                      {step.num}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">
                      {step.title}
                    </h3>
                    <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">
                      {step.subtitle}
                    </div>
                    <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Quality Inspected</span>
                    <span className="text-emerald-600 font-bold">✓ Standardized</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 3. ARTISAN COMMUNITY IMPACT */}
        <section className="py-20 bg-obsidian-950 text-white border-t border-obsidian-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
                  Fair-Trade Social Impact
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Empowering 500+ Rural Women Across Northern Bengal
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Northern Bangladesh has historically faced economic vulnerability during the agricultural lean seasons (Monga). By organizing decentralized cottage artisan clusters in <strong>Kaunia, Rangpur</strong> into permanent export production networks, we guarantee sustainable year-round incomes.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                    <div className="text-2xl font-bold text-amber-400">85%+</div>
                    <div className="text-stone-300 font-semibold mt-1">Female Artisan Workforce</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">Empowering rural mothers</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                    <div className="text-2xl font-bold text-emerald-400">+35%</div>
                    <div className="text-stone-300 font-semibold mt-1">Above Minimum Wage</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">Fair piece-rate compensation</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href="/contact" 
                    className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow inline-block"
                  >
                    Partner with Our Artisan Network →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-obsidian-750 bg-stone-900 p-2">
                  <img 
                    src="/assets/products/kaisa-grass-deep-baskets.jpg" 
                    alt="Authentic Artisanal Production Baskets" 
                    className="w-full h-[440px] object-cover rounded-2xl"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
