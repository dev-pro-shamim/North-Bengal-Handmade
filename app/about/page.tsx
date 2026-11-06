'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linen-50 text-stone-800 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        {/* HERO BANNER */}
        <section className="bg-obsidian-950 text-white py-20 border-b border-obsidian-850 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold uppercase tracking-widest mb-4">
                Our Heritage & Enterprise
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Rooted in Northern Bengal. <span className="text-gradient-gold">Crafted for Global Living.</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-6 leading-relaxed font-light">
                Since 2011, North Bengal Handmade Products BD has bridged the artisanal mastery of rural women weavers in Northern Bangladesh with the stringent compliance and delivery requirements of international retail brands.
              </p>
            </div>
          </div>
        </section>

        {/* 1. AT A GLANCE METRICS */}
        <section className="bg-white border-b border-stone-200 py-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-mono">2011</div>
                <div className="text-xs uppercase font-bold tracking-wider text-amber-700 mt-1">Exporting Excellence Since</div>
                <div className="text-[11px] text-stone-500 mt-1">15+ years of craft mastery</div>
              </div>
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">500+</div>
                <div className="text-xs uppercase font-bold tracking-wider text-emerald-700 mt-1">Rural Women Artisans</div>
                <div className="text-[11px] text-stone-500 mt-1">85%+ female empowerment</div>
              </div>
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-mono">100%</div>
                <div className="text-xs uppercase font-bold tracking-wider text-amber-700 mt-1">Natural Biodegradable</div>
                <div className="text-[11px] text-stone-500 mt-1">Kaisa, Seagrass, Jute & Cotton</div>
              </div>
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-mono">FOB</div>
                <div className="text-xs uppercase font-bold tracking-wider text-amber-700 mt-1">Chittagong Seaport (BDCGP)</div>
                <div className="text-[11px] text-stone-500 mt-1">Global container shipping</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. OUR STORY & ROOTS */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-200 bg-white">
                  <img 
                    src="/assets/products/cotton-rope-two-tone-baskets.jpg" 
                    alt="Artisanal Baskets Production" 
                    className="w-full h-[420px] object-contain p-4"
                  />
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-md">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">Official Slogan</span>
                  <p className="text-xs font-bold text-stone-900 mt-1">
                    "Ethically Handmade | Naturally Beautiful | Certified for Global Standards"
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
                  Our Journey
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
                  Preserving Indigenous Weaving Heritage with Commercial Precision
                </h2>
                <p className="text-stone-700 text-sm leading-relaxed">
                  Northern Bangladesh is home to a centuries-old tradition of handcrafting functional vessels from indigenous river grasses, golden tossa jute, and sun-cured reeds. For generations, these skills were practiced within family cottages during the agricultural off-season.
                </p>
                <p className="text-stone-700 text-sm leading-relaxed">
                  In 2011, <strong>North Bengal Handmade Products BD</strong> was established to institutionalize this incredible artisan talent into a formalized, export-ready enterprise. We established training programs, standardized dimensional grading, introduced non-toxic Azo-free dyeing technologies, and enforced rigorous moisture control protocols.
                </p>
                <p className="text-stone-700 text-sm leading-relaxed">
                  Today, we operate as a verified exporter with statutory government credentials (ERC No: <strong>260326211291422</strong>, BIN: <strong>004681231-0102</strong>), supplying luxury department stores, lifestyle brands, and boutique retail chains across North America, Europe, Australia, and Japan.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 3. DUAL OPERATIONAL HUBS */}
        <section className="py-20 bg-white border-t border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-800 text-xs font-bold uppercase tracking-widest bg-amber-100 px-3.5 py-1 rounded-full">
                Infrastructure & Network
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
                Dual Operational Hubs for Flawless Execution
              </h2>
              <p className="text-stone-600 mt-2 text-sm">
                Our bifurcated structure ensures artisan closeness at the grassroots level and friction-free commercial communication for international buyers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Hub 1: Dhaka HQ */}
              <div className="p-8 rounded-3xl bg-obsidian-950 text-white border border-obsidian-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                    Commercial & Liaison HQ
                  </div>
                  <h3 className="text-2xl font-bold text-white">Sector-06, Uttara, Dhaka</h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    House No. 08, Road No. 08, Sector-06, Uttara PS, Dhaka-1230, Bangladesh
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-obsidian-800 space-y-3 text-xs text-stone-300">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>International client communications, contracts, and OEM tech-pack reviews</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>Letter of Credit (L/C), banking coordination with Agrani Bank Gazipur Corporate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>Express courier dispatch of physical pre-production approval samples (DHL / FedEx)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>Conveniently located 15 minutes from Hazrat Shahjalal International Airport (DAC)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-obsidian-850 flex items-center justify-between text-xs">
                  <span className="text-stone-400">Direct Phone:</span>
                  <a href="tel:+8801740305936" className="text-amber-400 font-mono font-bold">+880 1740-305936</a>
                </div>
              </div>

              {/* Hub 2: Kaunia Factory */}
              <div className="p-8 rounded-3xl bg-linen-100 text-stone-900 border border-stone-300 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                    Artisan Workshop & Export Processing Center
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900">Kaunia, Rangpur Division</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Sarai, Lalbagh, Kaunia, Rangpur-5440, Northern Bangladesh
                  </p>

                  <div className="mt-6 pt-6 border-t border-stone-300 space-y-3 text-xs text-stone-700">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Direct proximity to Northern Bengal wild Kaisa grass river beds and golden jute crops</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Master artisan coiling, braiding, lock-stitching, and assembly workshops</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Moisture meter testing (<span className="font-bold">10–12% threshold</span>) and hot-air dehumidification chambers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Export carton packaging, palletization, and bonded container loading for Chittagong port</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-300 flex items-center justify-between text-xs">
                  <span className="text-stone-600">Union Parishad Lic:</span>
                  <span className="font-mono font-bold text-stone-900">Trade License No. 147</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. KEY LEADERSHIP */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-800 text-xs font-bold uppercase tracking-widest bg-amber-200/80 px-3.5 py-1 rounded-full">
                Governance & Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
                Executive Management
              </h2>
              <p className="text-stone-600 mt-2 text-sm">
                Registered partnership firm led by seasoned industry practitioners dedicated to ethical growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-soft-card">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 font-black text-2xl flex items-center justify-center mb-6">
                  MA
                </div>
                <h3 className="text-xl font-bold text-stone-900">Md. Mostaq Ahmed</h3>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">Managing Partner — Operations & Sourcing</div>
                <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                  Supervises raw material procurement across Northern Bengal riverine zones, artisan guild management, quality control checkpoints, and factory assembly in Kaunia, Rangpur.
                </p>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Location: Rangpur & Dhaka</span>
                  <span className="text-emerald-700 font-semibold">Registered Partner</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-soft-card">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white font-black text-2xl flex items-center justify-center mb-6">
                  AM
                </div>
                <h3 className="text-xl font-bold text-stone-900">Md. Abdullah Al Mamun</h3>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">Managing Partner — Commercial & Export Relations</div>
                <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                  Leads international buyer correspondence, commercial documentation, customs compliance (ERC, NBR VAT, e-TIN), ocean logistics routing from Chittagong, and client bespoke tech-pack executions.
                </p>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Location: Uttara, Dhaka HQ</span>
                  <span className="text-emerald-700 font-semibold">Registered Partner</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. ETHICAL COMMITMENTS (SDGs) */}
        <section className="py-20 bg-obsidian-950 text-white border-t border-obsidian-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
                Ethical Commitments
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
                Aligned with UN Sustainable Development Goals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                <div className="text-2xl font-black text-amber-400 mb-2">SDG 1 & 8</div>
                <div className="font-bold text-white text-sm">Decent Work & Fair Wages</div>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Direct artisan compensation structure 35% above regional minimum rural baselines, with guaranteed year-round purchase orders.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                <div className="text-2xl font-black text-emerald-400 mb-2">SDG 5</div>
                <div className="font-bold text-white text-sm">Gender Equality</div>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Over 85% of our weavers are rural women, providing financial independence, healthcare security, and education for their children.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                <div className="text-2xl font-black text-blue-400 mb-2">SDG 12</div>
                <div className="font-bold text-white text-sm">Responsible Consumption</div>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  100% natural and biodegradable products engineered to displace single-use plastics and petroleum-derived polymers worldwide.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                <div className="text-2xl font-black text-purple-400 mb-2">SDG 13</div>
                <div className="font-bold text-white text-sm">Climate Action</div>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Jute and wild kaisa grass are carbon-absorbing crops requiring minimal irrigation and zero chemical pesticides.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link 
                href="/products" 
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg transition inline-block"
              >
                Browse Our Authentic Products Catalog →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
