'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CertificationsPage() {
  const [selectedDoc, setSelectedDoc] = useState<{
    img: string;
    title: string;
    authority: string;
    regNumber: string;
    details: string[];
  } | null>(null);

  const certificates = [
    {
      id: 'erc',
      title: 'Export Registration Certificate (ERC)',
      regNumber: '260326211291422',
      authority: 'Office of the Chief Controller of Imports and Exports, Bangladesh',
      date: 'First Issued: 21 April, 2022',
      type: 'Exporter of Office',
      img: '/assets/certificates/erc-certificate.png',
      summary: 'Statutory authorization granting North Bengal Handmade Products BD the legal license to manufacture and export goods internationally.',
      details: [
        'Registration Number: 260326211291422',
        'Issuing Body: Office of the Chief Controller of Imports & Exports, Dhaka',
        'Official Signatory: Md. Rezaul Karim, Executive Officer',
        'Nominated Bank: Agrani Bank Ltd., Gazipur Corporate Branch',
        'Address: House No: 08, Road No: 08, Sector-06, Uttara, Dhaka-1230'
      ]
    },
    {
      id: 'bin',
      title: 'VAT Registration Certificate (Mushak-2.3)',
      regNumber: '004681231-0102',
      authority: 'National Board of Revenue (NBR), Dhaka (North)',
      date: 'Effective: April 2022',
      type: 'Manufacturing & Exports',
      img: '/assets/certificates/vat-certificate.png',
      summary: 'Business Identification Number (BIN) certifying active Value Added Tax registration under the VAT and Supplementary Duty Act 2012.',
      details: [
        'BIN: 004681231-0102',
        'NBR Commissionerate: Customs, Excise and VAT Commissionerate, Dhaka (North), Tongi Division',
        'Type of Ownership: Partnership Firm',
        'Major Economic Activity: Manufacturing, Exports',
        'Associated e-TIN: 465746253246'
      ]
    },
    {
      id: 'tin',
      title: 'Taxpayer Identification Number (e-TIN)',
      regNumber: '465746253246',
      authority: 'National Board of Revenue, Taxes Circle-190, Dhaka',
      date: 'Issued: February 07, 2022',
      type: 'Registered Firm Taxpayer',
      img: '/assets/certificates/tin-certificate.png',
      summary: 'Verified Taxpayer Identification Number certifying full tax compliance under the Income Tax Ordinance of Bangladesh.',
      details: [
        'TIN: 465746253246',
        'Jurisdiction: Taxes Circle-190 (Salary), Taxes Zone 09, Dhaka',
        'Entity Status: Firm',
        'Address: House No. # 08, Road No. # 08, Sector # 06, Uttara, Dhaka, PO: 1230',
        'Deputy Commissioner of Taxes Office: Sector-04, Uttara, Dhaka'
      ]
    },
    {
      id: 'trade',
      title: 'Government Trade License',
      regNumber: 'License No. 147',
      authority: '4 No. Shahidbagh Union Parishad, Kaunia, Rangpur',
      date: 'Valid up to: 30 June, 2027',
      type: 'Handicrafts Manufacturer & Exporter',
      img: '/assets/certificates/trade-license.jpg',
      summary: 'Official local government trade license authorizing workshop operations, artisan employment, and export assembly in Kaunia, Rangpur.',
      details: [
        'Trade License Serial: No. 147',
        'Local Council: 4 No. Shahidbagh Union Parishad, Upazila: Kaunia, District: Rangpur',
        'Proprietors / Partners: Md. Mostaq Ahmed & Md. Abdullah Al Mamun',
        'Permanent Location: Sarai, Lalbagh, Kaunia, Rangpur',
        'Nature of Business: Handicraft Manufacturer, Order Supplier & Exporter'
      ]
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
                Legal Compliance & Governance
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Government Verified <span className="text-gradient-gold">Exporter</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-4 leading-relaxed font-light">
                We operate with 100% legal transparency and statutory documentation under the laws of the People's Republic of Bangladesh. Click any certificate below to inspect the high-resolution original document.
              </p>
            </div>
          </div>
        </section>

        {/* STATUTORY REGISTRATION CARDS */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedDoc(cert)}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft-card hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between items-center text-center group"
                >
                  <div className="w-full flex flex-col items-center">
                    {/* Document Thumbnail */}
                    <div className="h-64 w-full rounded-2xl bg-stone-100 overflow-hidden border border-stone-200 p-2 mb-4 group-hover:border-amber-400 transition-colors flex items-center justify-center">
                      <img 
                        src={cert.img} 
                        alt={cert.title} 
                        className="h-full w-auto max-w-full object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider text-center">
                      {cert.type}
                    </div>
                    <h3 className="font-bold text-base text-stone-900 mt-1 group-hover:text-amber-700 transition text-center">
                      {cert.title}
                    </h3>
                    <div className="mt-2 inline-block px-2.5 py-1 rounded-lg bg-stone-100 font-mono text-xs font-bold text-stone-800 text-center">
                      {cert.regNumber}
                    </div>
                    <p className="text-stone-500 text-xs mt-3 line-clamp-2 text-center">
                      {cert.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-xs text-amber-800 font-bold w-full text-center">
                    <span>Inspect Document</span>
                    <span>🔍</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* GLOBAL TRADE COMPLIANCE STANDARDS */}
        <section className="py-20 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-800 text-xs font-bold uppercase tracking-widest bg-amber-100 px-3.5 py-1 rounded-full">
                International Export Protocols
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4">
                Export Compliance for USA, EU & Global Markets
              </h2>
              <p className="text-stone-600 mt-2 text-sm">
                Every container shipment from our Kaunia workshop is documented to meet strict port clearance criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-linen-100 border border-stone-300">
                <div className="text-3xl mb-3">🌿</div>
                <h4 className="font-bold text-lg text-stone-900">REACH & Azo-Free Dyes</h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Our dyed accents utilize eco-certified, heavy-metal-free, and Azo-free colorants conforming strictly with European Union REACH Regulation (EC No 1907/2006). Completely non-toxic for infants and home pets.
                </p>
                <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] font-bold text-emerald-800">
                  ✓ Certified Non-Toxic
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-linen-100 border border-stone-300">
                <div className="text-3xl mb-3">📦</div>
                <h4 className="font-bold text-lg text-stone-900">Fumigation & Phyto-Sanitary</h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Export containers undergo certified Methyl Bromide / Phosphine fumigation with government Phyto-Sanitary Certificates issued prior to vessel departure from Chittagong port (ISPM-15 standard compliant).
                </p>
                <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] font-bold text-emerald-800">
                  ✓ ISPM-15 Pest-Free Certified
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-linen-100 border border-stone-300">
                <div className="text-3xl mb-3">📑</div>
                <h4 className="font-bold text-lg text-stone-900">GSP Form-A & Origin</h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Certificates of Origin (GSP Form-A / Non-Preferential COO) issued by the Export Promotion Bureau (EPB) and Chamber of Commerce for preferential duty-free customs tariff entry across participating buyer nations.
                </p>
                <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] font-bold text-emerald-800">
                  ✓ Duty-Free Tariff Eligible
                </div>
              </div>

            </div>

            {/* Nominated Banking Section */}
            <div className="mt-12 p-8 rounded-3xl bg-obsidian-950 text-white border border-obsidian-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">Authorized Foreign Exchange Bank</div>
                <h4 className="text-xl font-bold text-white">Agrani Bank Limited — Gazipur Corporate Branch</h4>
                <p className="text-xs text-stone-400">
                  Nominated in Government Export Registration Certificate (ERC) for swift international Wire Transfers, TT, and Irrevocable Letters of Credit (L/C).
                </p>
              </div>
              <Link 
                href="/company-profile" 
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition shrink-0"
              >
                Inspect Corporate Dossier →
              </Link>
            </div>

          </div>
        </section>

        {/* FULLSCREEN DOCUMENT INSPECTION MODAL */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-300 p-6 sm:p-8 relative">
              
              <button 
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-6 bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <img 
                    src={selectedDoc.img} 
                    alt={selectedDoc.title} 
                    className="w-full h-auto max-h-[500px] object-contain rounded-xl mx-auto"
                  />
                  <div className="text-center text-[11px] text-stone-400 mt-2">
                    Official Government Document Scan
                  </div>
                </div>

                <div className="md:col-span-6 space-y-4">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                    Statutory Credential
                  </span>
                  <h3 className="text-2xl font-bold text-stone-900 leading-tight">
                    {selectedDoc.title}
                  </h3>
                  <div className="p-3 rounded-xl bg-linen-100 border border-stone-300 font-mono text-sm font-bold text-amber-900">
                    {selectedDoc.regNumber}
                  </div>

                  <div className="space-y-2 pt-2 text-xs text-stone-700">
                    <strong className="block text-stone-900">Verified Particulars:</strong>
                    {selectedDoc.details.map((d, idx) => (
                      <div key={idx} className="flex items-start gap-2 py-1 border-b border-stone-100">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button 
                      onClick={() => window.open(selectedDoc.img, '_blank')}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition"
                    >
                      Open Full High-Res File ↗
                    </button>
                    <button 
                      onClick={() => setSelectedDoc(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs uppercase transition"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
