'use client';

import React from 'react';
import Link from 'next/link';

export default function CompanyProfilePage() {
  return (
    <div className="bg-stone-200 text-stone-900 min-h-screen py-8 sm:py-12 font-sans">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-5xl mx-auto px-4 mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 bg-white px-4 py-2.5 rounded-xl border border-stone-300 shadow-sm hover:bg-stone-50 transition"
        >
          ← Return to Main Website
        </Link>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()} 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-xl shadow transition"
          >
            🖨️ Print / Save as PDF
          </button>
          <a 
            href="https://wa.me/8801740305936" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl shadow transition"
          >
            💬 WhatsApp Export Desk
          </a>
        </div>
      </div>

      {/* Main Dossier Document Container */}
      <main className="max-w-5xl mx-auto bg-white border border-stone-300 shadow-2xl rounded-3xl overflow-hidden p-8 sm:p-14 print:p-0 print:border-none print:shadow-none print:rounded-none">
        
        {/* Header with Professional Logos */}
        <header className="border-b-2 border-stone-900 pb-8 mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-3">
              <img 
                src="/assets/logo/logo-primary.svg" 
                alt="North Bengal Handmade Products BD Logo" 
                className="h-16 w-auto max-w-[380px] object-contain"
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Verified Institutional Exporter Dossier
              </div>
              <p className="text-xs text-stone-600 italic max-w-xl">
                Direct Manufacturer & Exporter of Wild Kaisa Grass Storage Baskets, Coiled Seagrass Hampers, Braided Golden Jute Planters & Eco-Lifestyle Furnishings
              </p>
            </div>

            <div className="flex items-center gap-4 sm:border-l sm:border-stone-200 sm:pl-6">
              <img 
                src="/assets/logo/logo-badge.svg" 
                alt="Official Seal Crest" 
                className="w-20 h-20 object-contain drop-shadow"
              />
              <div className="text-xs text-stone-600 space-y-1">
                <div><strong className="text-stone-900">Edition:</strong> 2026/2027 Export Portfolio</div>
                <div><strong className="text-stone-900">ERC:</strong> <span className="font-mono font-bold text-amber-800">260326211291422</span></div>
                <div><strong className="text-stone-900">BIN:</strong> <span className="font-mono font-bold text-emerald-800">004681231-0102</span></div>
                <div><strong className="text-stone-900">Phone:</strong> <span className="font-mono font-bold text-stone-900">+880 1740-305936</span></div>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1: Statutory Credentials */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-stone-900 border-l-4 border-amber-600 pl-3 mb-4 uppercase tracking-wider">
            1. Corporate Identity & Statutory Verification
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-stone-300">
              <tbody>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 w-1/3 border-r border-stone-200">Registered Corporate Entity</th>
                  <td className="p-3 font-bold text-stone-900">NORTH BENGAL HANDMADE PRODUCTS BD<br/><span className="text-stone-500 font-normal text-[11px]">(M/s. NORTH BANGAL HANDMADE PRODUCTS BD)</span></td>
                </tr>
                <tr className="border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Legal Constitution</th>
                  <td className="p-3 text-stone-800">Partnership Firm (Under Partnership Act of Bangladesh)</td>
                </tr>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Export Registration Certificate (ERC)</th>
                  <td className="p-3 font-mono font-bold text-amber-800">
                    260326211291422
                    <span className="block font-sans font-normal text-[11px] text-stone-500">Chief Controller of Imports and Exports, Ministry of Commerce, Bangladesh</span>
                  </td>
                </tr>
                <tr className="border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Value Added Tax (VAT) / BIN Number</th>
                  <td className="p-3 font-mono font-bold text-emerald-800">
                    004681231-0102 (Mushak-2.3)
                    <span className="block font-sans font-normal text-[11px] text-stone-500">Customs, Excise & VAT Commissionerate, Dhaka (North), Tongi Division</span>
                  </td>
                </tr>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Taxpayer Identification Number (e-TIN)</th>
                  <td className="p-3 font-mono font-bold text-blue-800">
                    465746253246
                    <span className="block font-sans font-normal text-[11px] text-stone-500">Taxes Circle-190, Taxes Zone 09, Dhaka (Status: Registered Firm)</span>
                  </td>
                </tr>
                <tr className="border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Trade License</th>
                  <td className="p-3 font-mono font-bold text-stone-900">
                    License No: 147
                    <span className="block font-sans font-normal text-[11px] text-stone-500">4 No. Shahidbagh Union Parishad, Kaunia Upazila, Rangpur</span>
                  </td>
                </tr>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Nominated Commercial Bank</th>
                  <td className="p-3 font-bold text-stone-900">Agrani Bank Ltd., Gazipur Corporate Branch</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Corporate & Export Liaison HQ</th>
                  <td className="p-3 text-stone-800">House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230, Bangladesh</td>
                </tr>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Artisan Production & Loom Center</th>
                  <td className="p-3 text-stone-800">Sarhi, Shahidbagh Union, Kaunia Upazila, Rangpur District, Bangladesh</td>
                </tr>
                <tr>
                  <th className="p-3 font-bold text-stone-900 border-r border-stone-200">Managing Partners</th>
                  <td className="p-3 text-stone-800">
                    1. <strong>Md. Mostaq Ahmed</strong> (Proprietor / Partner - Head of Rangpur Craft Hub)<br/>
                    2. <strong>Md. Abdullah Al Mamun</strong> (Proprietor / Partner - Head of Dhaka Export Desk)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Executive Foreword */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-stone-900 border-l-4 border-amber-600 pl-3 mb-4 uppercase tracking-wider">
            2. Executive Foreword & Background
          </h2>
          <div className="text-xs text-stone-700 leading-relaxed space-y-3">
            <p>
              Established to bring the rich artisanal heritage of Northern Bangladesh to discerning global consumers, <strong>North Bengal Handmade Products BD</strong> operates a vertically integrated manufacturing and export model. Originating from <strong>Kaunia, Rangpur</strong>—the geographical epicenter of <em>Shatranji</em> hand-looming—our operations bridge rural cottage artisan mastery with institutional export compliance.
            </p>
            <p>
              By sourcing directly from local riverine jute farmers and engaging a dedicated collective of more than <strong>500 rural female artisans</strong>, we provide complete supply-chain traceability, ethical fair compensation, and zero forced labor. Every product leaving our Kaunia looms is an ambassador of sustainable living: 100% biodegradable, carbon-negative, and free of synthetic plastics.
            </p>
          </div>
        </section>

        {/* Section 3: Official Certificate Reproductions */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-stone-900 border-l-4 border-amber-600 pl-3 mb-4 uppercase tracking-wider">
            3. Government Registration Certificate Reproductions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 border border-stone-300 rounded-2xl bg-stone-50 flex flex-col items-center">
              <img src="/assets/certificates/erc-certificate.png" alt="ERC Certificate" className="h-64 object-contain rounded-lg border border-stone-200 mb-2"/>
              <div className="text-center">
                <span className="font-bold text-stone-900 text-xs block">Export Registration Certificate (ERC)</span>
                <span className="font-mono text-xs text-amber-800 font-bold">No: 260326211291422</span>
              </div>
            </div>

            <div className="p-4 border border-stone-300 rounded-2xl bg-stone-50 flex flex-col items-center">
              <img src="/assets/certificates/vat-certificate.png" alt="VAT Certificate" className="h-64 object-contain rounded-lg border border-stone-200 mb-2"/>
              <div className="text-center">
                <span className="font-bold text-stone-900 text-xs block">VAT / BIN Registration (Mushak-2.3)</span>
                <span className="font-mono text-xs text-emerald-800 font-bold">BIN: 004681231-0102</span>
              </div>
            </div>

            <div className="p-4 border border-stone-300 rounded-2xl bg-stone-50 flex flex-col items-center">
              <img src="/assets/certificates/tin-certificate.png" alt="TIN Certificate" className="h-64 object-contain rounded-lg border border-stone-200 mb-2"/>
              <div className="text-center">
                <span className="font-bold text-stone-900 text-xs block">Taxpayer Identification Number (e-TIN)</span>
                <span className="font-mono text-xs text-blue-800 font-bold">TIN: 465746253246</span>
              </div>
            </div>

            <div className="p-4 border border-stone-300 rounded-2xl bg-stone-50 flex flex-col items-center">
              <img src="/assets/certificates/trade-license.jpg" alt="Trade License" className="h-64 object-contain rounded-lg border border-stone-200 mb-2"/>
              <div className="text-center">
                <span className="font-bold text-stone-900 text-xs block">Local Government Trade License</span>
                <span className="font-mono text-xs text-stone-900 font-bold">License No: 147</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Authorized Signatories */}
        <section className="border-t-2 border-stone-900 pt-8 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-stone-800">
            <div>
              <h4 className="font-bold text-stone-900 uppercase text-xs mb-3">Authorized Partners & Signatories:</h4>
              <div className="space-y-4">
                <div>
                  <strong className="text-stone-900 text-sm block">Md. Mostaq Ahmed</strong>
                  <span className="text-stone-600">Proprietor / Partner</span><br/>
                  <span className="text-stone-500">Director of Artisan Operations & Dye Formulations, Kaunia, Rangpur</span>
                </div>
                <div>
                  <strong className="text-stone-900 text-sm block">Md. Abdullah Al Mamun</strong>
                  <span className="text-stone-600">Proprietor / Partner</span><br/>
                  <span className="text-stone-500">Director of Commercial Export & Global Accounts, Uttara, Dhaka</span>
                </div>
              </div>
            </div>

            <div className="sm:border-l sm:border-stone-200 sm:pl-8 space-y-3">
              <h4 className="font-bold text-stone-900 uppercase text-xs mb-3">Direct Commercial Contact:</h4>
              <div>
                <strong className="text-stone-900">Phone / WhatsApp:</strong><br/>
                <span className="font-mono text-base font-bold text-amber-800">+880 1740-305936</span>
              </div>
              <div>
                <strong className="text-stone-900">Official Commercial Email:</strong><br/>
                <span className="font-mono text-stone-800">export@northbengalhandmade.com</span>
              </div>
              <div>
                <strong className="text-stone-900">Corporate Export Address:</strong><br/>
                House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230, Bangladesh.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400">
            This document represents the official certified corporate capability profile of North Bengal Handmade Products BD. All rights reserved.
          </div>
        </section>

      </main>

      <footer className="max-w-5xl mx-auto px-4 mt-6 text-center text-xs text-stone-500 print:hidden">
        &copy; {new Date().getFullYear()} North Bengal Handmade Products BD • Verified Exporter under the Government of Bangladesh.
      </footer>
    </div>
  );
}
