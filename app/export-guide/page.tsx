'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ExportGuidePage() {
  const [selectedProduct, setSelectedProduct] = useState('kaisa_deep');
  const [quantity, setQuantity] = useState(500);

  // Estimator Calculations
  const getCalculations = () => {
    let weightPerUnit = 2.1; // kg
    let cbmPerUnit = 0.007; // CBM per unit nested set
    let pcsPerCarton = 6;

    if (selectedProduct === 'kaisa_deep') {
      weightPerUnit = 2.1; cbmPerUnit = 0.0075; pcsPerCarton = 6;
    } else if (selectedProduct === 'seagrass_hamper') {
      weightPerUnit = 2.4; cbmPerUnit = 0.009; pcsPerCarton = 4;
    } else if (selectedProduct === 'jute_planter') {
      weightPerUnit = 0.85; cbmPerUnit = 0.0025; pcsPerCarton = 20;
    } else if (selectedProduct === 'kaisa_tray') {
      weightPerUnit = 1.6; cbmPerUnit = 0.005; pcsPerCarton = 8;
    } else if (selectedProduct === 'rope_basket') {
      weightPerUnit = 1.95; cbmPerUnit = 0.0065; pcsPerCarton = 12;
    } else if (selectedProduct === 'tote_bag') {
      weightPerUnit = 0.55; cbmPerUnit = 0.0018; pcsPerCarton = 50;
    }

    const totalWeight = Math.round(quantity * weightPerUnit);
    const totalCBM = (quantity * cbmPerUnit).toFixed(2);
    const totalCartons = Math.ceil(quantity / pcsPerCarton);

    let recommendedFreight = 'LCL Consolidated Sea Freight';
    const cbmVal = parseFloat(totalCBM);
    if (quantity <= 150) {
      recommendedFreight = 'Air Express / Air Cargo (DHL / DAC)';
    } else if (cbmVal > 15 && cbmVal <= 28) {
      recommendedFreight = "20' Standard Ocean Container (FCL)";
    } else if (cbmVal > 28 && cbmVal <= 58) {
      recommendedFreight = "40' Standard Ocean Container (FCL)";
    } else if (cbmVal > 58) {
      recommendedFreight = "40' High-Cube (HQ) Ocean Container (FCL)";
    }

    return { totalWeight, totalCBM, totalCartons, recommendedFreight };
  };

  const calc = getCalculations();

  const transitTimes = [
    { destination: 'Rotterdam / Hamburg / Antwerp (Europe)', transit: '24–28 Days', route: 'Direct Feeder to Colombo/Singapore → European Hub' },
    { destination: 'Felixstowe / Southampton (UK)', transit: '26–30 Days', route: 'Feeder via Colombo/Port Klang → UK East Coast' },
    { destination: 'New York / Savannah / Norfolk (US East Coast)', transit: '32–36 Days', route: 'Trans-Atlantic via Suez or Trans-Pacific' },
    { destination: 'Los Angeles / Long Beach (US West Coast)', transit: '28–32 Days', route: 'Pacific Route via Singapore/Busan' },
    { destination: 'Sydney / Melbourne (Australia)', transit: '18–22 Days', route: 'Southbound Express via Port Klang' },
    { destination: 'Tokyo / Yokohama (Japan)', transit: '14–18 Days', route: 'Direct East Asian Express Service' }
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold uppercase tracking-widest mb-4">
                International Logistics & Trade
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Global Export & <span className="text-gradient-gold">Freight Guide</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-4 leading-relaxed font-light">
                Comprehensive guide for commercial importers, department store buyers, and freight forwarders. Calculate ocean container volume (CBM), check sea transit times from Chittagong seaport, and review export incoterms.
              </p>
            </div>
          </div>
        </section>

        {/* 1. INTERACTIVE CBM & CONTAINER CALCULATOR */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-300 shadow-xl">
              <div className="max-w-2xl mb-8">
                <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">
                  Live Estimator
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                  Ocean Container & Freight Volume Estimator
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-2">
                  Select your target handmade product line and quantity to calculate estimated weight, master cartons, and container requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Inputs */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      1. Select Product Line
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={e => setSelectedProduct(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 text-stone-900 text-sm font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="kaisa_deep">Kaisa Grass Deep Baskets (3-in-1 Nested Sets)</option>
                      <option value="seagrass_hamper">Seagrass Cylindrical Hampers & Bowls (Ensemble)</option>
                      <option value="jute_planter">Braided Golden Jute Tapered Planters & Bins</option>
                      <option value="kaisa_tray">Low-Profile Kaisa Grass Shelf Trays (Set of 3)</option>
                      <option value="rope_basket">Two-Tone Cotton Rope Storage Baskets (Set of 3)</option>
                      <option value="tote_bag">Handcrafted Seagrass & Jute Market Totes</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        2. Target Order Quantity:
                      </label>
                      <span className="font-mono text-base font-extrabold text-amber-700">
                        {quantity} {selectedProduct.includes('set') || selectedProduct.includes('kaisa') || selectedProduct.includes('rope') ? 'Sets' : 'Units'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={50} 
                      max={10000} 
                      step={50} 
                      value={quantity} 
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                      <span>50 (Sample LCL)</span>
                      <span>500 (Standard FCL)</span>
                      <span>10,000 (Multi-FCL)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200 text-xs text-stone-600 space-y-1">
                    <div className="font-bold text-stone-900">💡 Nesting Volume Savings:</div>
                    <p>Our 3-in-1 nested packaging cuts ocean shipping volume by <strong>over 65%</strong>, lowering landing cost per unit for international distributors.</p>
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="lg:col-span-6">
                  <div className="p-8 rounded-3xl bg-obsidian-950 text-white border border-obsidian-800 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Estimated Cargo Output</span>
                      <span className="text-[11px] font-mono text-emerald-400">Ready for FOB Chittagong</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                        <div className="text-[11px] text-stone-400 uppercase font-bold">Estimated Weight</div>
                        <div className="text-2xl font-mono font-extrabold text-white mt-1">
                          {calc.totalWeight} <span className="text-xs font-sans text-stone-400 font-normal">kg</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                        <div className="text-[11px] text-stone-400 uppercase font-bold">Ocean Volume</div>
                        <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1">
                          {calc.totalCBM} <span className="text-xs font-sans text-stone-400 font-normal">CBM</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                        <div className="text-[11px] text-stone-400 uppercase font-bold">Master Cartons</div>
                        <div className="text-2xl font-mono font-extrabold text-white mt-1">
                          {calc.totalCartons} <span className="text-xs font-sans text-stone-400 font-normal">boxes</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800">
                        <div className="text-[11px] text-stone-400 uppercase font-bold">Port of Loading</div>
                        <div className="text-base font-bold text-emerald-300 mt-1">
                          BDCGP <span className="text-[10px] text-stone-400 block font-normal">Chittagong Seaport</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30">
                      <div className="text-[11px] uppercase font-bold text-amber-300">Recommended Freight Mode:</div>
                      <div className="text-base font-extrabold text-white mt-0.5">{calc.recommendedFreight}</div>
                    </div>

                    <div className="pt-2">
                      <Link 
                        href="/contact" 
                        className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition text-center block shadow"
                      >
                        Request Official Proforma FOB Quote →
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 2. OCEAN TRANSIT TIMES TABLE */}
        <section className="py-20 bg-white border-t border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-blue-800 text-xs font-bold uppercase tracking-widest bg-blue-100 px-3.5 py-1 rounded-full">
                Global Shipping Lanes
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
                Estimated Ocean Transit Times from Chittagong (BDCGP)
              </h2>
              <p className="text-stone-600 mt-2 text-sm">
                Container feeder vessels depart Chittagong Seaport multiple times weekly connecting with global mother vessel hubs.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-stone-300 shadow-soft-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-obsidian-950 text-white uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Destination Region & Ports</th>
                    <th className="py-4 px-6">Port-to-Port Transit</th>
                    <th className="py-4 px-6">Transshipment Routing</th>
                    <th className="py-4 px-6">Vessel Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {transitTimes.map((t, idx) => (
                    <tr key={idx} className="hover:bg-linen-100 transition-colors">
                      <td className="py-4 px-6 font-bold text-stone-900">{t.destination}</td>
                      <td className="py-4 px-6 font-mono font-bold text-amber-700">{t.transit}</td>
                      <td className="py-4 px-6 text-stone-600">{t.route}</td>
                      <td className="py-4 px-6 text-emerald-700 font-semibold">2–3 Sailings / Week</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. INCOTERMS & PAYMENT TERMS */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-soft-card">
                <h3 className="text-xl font-bold text-stone-900 mb-4">Supported International Incoterms</h3>
                <div className="space-y-4 text-xs text-stone-600">
                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200">
                    <strong className="text-stone-900 block text-sm">FOB Chittagong (BDCGP) — Standard</strong>
                    <p className="mt-1">We handle inland transport from Kaunia, export customs clearance, port handling, and loading onto buyer nominated ocean vessel.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200">
                    <strong className="text-stone-900 block text-sm">CIF / CFR (Destination Seaport)</strong>
                    <p className="mt-1">We manage ocean freight booking through tier-1 shipping lines (Maersk, MSC, Hapag-Lloyd, CMA CGM) directly to your home port.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200">
                    <strong className="text-stone-900 block text-sm">Air Freight via Dhaka (DAC)</strong>
                    <p className="mt-1">For urgent seasonal replenishment or sample dispatch via Hazrat Shahjalal International Airport, Dhaka.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-soft-card">
                <h3 className="text-xl font-bold text-stone-900 mb-4">Commercial Banking & Payment Terms</h3>
                <div className="space-y-4 text-xs text-stone-600">
                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200">
                    <strong className="text-stone-900 block text-sm">Irrevocable Letter of Credit (L/C at Sight)</strong>
                    <p className="mt-1">Preferred payment method for full container loads (FCL). Processed via our nominated bank: <strong>Agrani Bank Ltd., Gazipur Corporate Branch</strong>.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200">
                    <strong className="text-stone-900 block text-sm">T/T Wire Transfer</strong>
                    <p className="mt-1">30% Advance Deposit on purchase order confirmation; 70% balance payable upon submission of clean Shipped on Board Ocean Bill of Lading (B/L).</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-linen-100 border border-stone-200">
                    <strong className="text-stone-900 block text-sm">Pre-Production Sample Policy</strong>
                    <p className="mt-1">Physical samples prepared within 5–7 working days and dispatched via DHL / FedEx express courier with full tracking provided.</p>
                  </div>
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
