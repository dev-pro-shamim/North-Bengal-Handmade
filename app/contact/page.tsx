'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    phone: '',
    category: 'Handwoven Kaisa Grass Deep Storage Baskets',
    quantity: '500 sets',
    incoterm: 'FOB Chittagong Seaport (BDCGP)',
    destination: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ success: boolean; ref: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const product = params.get('product');
      const code = params.get('code');
      if (product) {
        setFormData(prev => ({
          ...prev,
          category: code ? `${product} (${code})` : product,
          notes: prev.notes || `Inquiry regarding export order for ${product} [${code || ''}].`
        }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedResult({ success: true, ref: data.reference });
      }
    } catch (err) {
      alert('Error submitting inquiry. Please contact us directly via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello North Bengal Handmade Products BD,\n\nI am contacting your commercial export team regarding an export order inquiry for:\n*${formData.category}*\n\n` +
    `• Target Quantity: ${formData.quantity}\n` +
    `• Preferred Incoterm: ${formData.incoterm}\n` +
    `• Buyer Name: ${formData.name || 'International Buyer'}\n` +
    `• Company: ${formData.company || 'B2B Importer'}\n\n` +
    `Please provide commercial FOB pricing and catalog information.`
  );

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
                Commercial Export Desk
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Connect with Our <span className="text-gradient-gold">Factory Desk</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-4 leading-relaxed font-light">
                Whether you need custom private-label prototyping, commercial container quotations, or factory visit coordination in Rangpur, our export directors respond within 12 business hours.
              </p>
            </div>
          </div>
        </section>

        {/* 1. CONTACT GRID & RFQ FORM */}
        <section className="py-20 bg-linen-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Dual Hubs & Direct Channels */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Instant WhatsApp Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-obsidian-950 text-white border border-emerald-500/30 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Fastest Response</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Live WhatsApp Desk</h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    Direct access to our commercial directors for immediate stock checks, factory video calls, and instant price estimates.
                  </p>
                  <div className="mt-6">
                    <a 
                      href={`https://wa.me/8801740305936?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition text-center block shadow-lg"
                    >
                      💬 Chat on WhatsApp (+880 1740-305936)
                    </a>
                  </div>
                </div>

                {/* Corporate Liaison Office */}
                <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-soft-card">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-3">
                    Corporate Liaison HQ
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">Uttara, Dhaka</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    House No. 08, Road No. 08, Sector-06, Uttara PS, Dhaka-1230, Bangladesh
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1 text-stone-500">
                    <p>• Commercial negotiations & contract execution</p>
                    <p>• Pre-production sample review & air express courier dispatch</p>
                    <p>• 15 minutes from Dhaka International Airport (DAC)</p>
                  </div>
                </div>

                {/* Manufacturing Center */}
                <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-soft-card">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-3">
                    Registered Workshop Center
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">Kaunia, Rangpur</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Sarai, Lalbagh, Kaunia, Rangpur-5440, Bangladesh
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1 text-stone-500">
                    <p>• 500+ rural women artisan coiling & weaving guilds</p>
                    <p>• Digital moisture meter testing & fumigation readiness</p>
                    <p>• Container packing for Chittagong Seaport (BDCGP)</p>
                  </div>
                </div>

                {/* Legal & Banking Particulars */}
                <div className="p-6 rounded-2xl bg-linen-100 border border-stone-300 text-xs space-y-2">
                  <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Statutory Details for Invoicing:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-stone-600 font-mono text-[11px]">
                    <div>ERC: <strong>260326211291422</strong></div>
                    <div>BIN: <strong>004681231-0102</strong></div>
                    <div>e-TIN: <strong>465746253246</strong></div>
                    <div>Trade Lic: <strong>No. 147</strong></div>
                  </div>
                  <div className="pt-2 text-stone-600 border-t border-stone-200">
                    Nominated Bank: <strong>Agrani Bank Ltd., Gazipur Corporate Branch</strong>
                  </div>
                </div>

              </div>

              {/* Right Column: Global RFQ Requisition Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-300 shadow-xl">
                  
                  <div className="mb-8">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                      Direct Factory RFQ
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                      Request Official Export Quotation
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Complete this form to receive itemized FOB Chittagong pricing and production schedules.
                    </p>
                  </div>

                  {submittedResult ? (
                    <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto">
                        ✓
                      </div>
                      <h4 className="text-xl font-bold text-emerald-900">Inquiry Dispatched Successfully!</h4>
                      <p className="text-xs text-stone-600 max-w-md mx-auto">
                        Your RFQ reference is <strong className="font-mono text-emerald-800">{submittedResult.ref}</strong>. Our commercial export team will review your quantities and respond within 12 business hours.
                      </p>
                      <button 
                        onClick={() => setSubmittedResult(null)}
                        className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">Your Full Name *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. John Smith"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">Company / Organization *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Scandinavian Living ApS"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">Official Work Email *</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">WhatsApp / Phone with Country Code *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="+44 20 1234 5678"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold uppercase mb-1">Product Category of Interest *</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 font-semibold focus:outline-none focus:border-amber-500"
                        >
                          <option value="Handwoven Kaisa Grass Deep Storage Baskets">Handwoven Kaisa Grass Deep Storage Baskets (Set of 3)</option>
                          <option value="Coiled Seagrass Cylindrical Hampers & Bowls">Coiled Seagrass Cylindrical Hampers & Succulent Bowls</option>
                          <option value="Hand-Braided Golden Jute Tapered Planters & Bins">Hand-Braided Golden Jute Tapered Planters & Bins</option>
                          <option value="Low-Profile Kaisa Grass Shelf Organizer Trays">Low-Profile Kaisa Grass Shelf Organizer Trays (Set of 3)</option>
                          <option value="Two-Tone Hand-Coiled Cotton Rope Storage Baskets">Two-Tone Hand-Coiled Cotton Rope Storage Baskets (Set of 3)</option>
                          <option value="Handcrafted Seagrass & Jute Market Tote Bags">Handcrafted Seagrass & Jute Market Tote Bags</option>
                          <option value="Custom OEM / ODM Private Label Tech-Pack">Bespoke Custom Tech-Pack Specification</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">Target Quantity *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. 500 sets / 1000 pcs"
                            value={formData.quantity}
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">Preferred Incoterm</label>
                          <select 
                            value={formData.incoterm}
                            onChange={e => setFormData({ ...formData, incoterm: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 font-semibold focus:outline-none focus:border-amber-500"
                          >
                            <option value="FOB Chittagong Seaport (BDCGP)">FOB Chittagong (BDCGP)</option>
                            <option value="CIF (Cost, Insurance & Freight)">CIF Destination Port</option>
                            <option value="CFR (Cost & Freight)">CFR Destination Port</option>
                            <option value="Air Freight via Dhaka (DAC)">Air Freight via Dhaka (DAC)</option>
                            <option value="EXW Kaunia / Dhaka">EXW Factory</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-700 font-bold uppercase mb-1">Destination Port</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Hamburg / Rotterdam"
                            value={formData.destination}
                            onChange={e => setFormData({ ...formData, destination: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold uppercase mb-1">Project Specifications & Notes</label>
                        <textarea 
                          rows={4}
                          placeholder="Provide custom dimensions, color choices, private brand hangtag requirements, or target delivery date..."
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-linen-50 focus:outline-none focus:border-amber-500"
                        ></textarea>
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                        >
                          {submitting ? 'Transmitting to Commercial Desk...' : 'Transmit Export RFQ Requisition →'}
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-400 text-center pt-1">
                        🔒 Confidentiality Guaranteed • Direct Factory Communication • Zero Spam
                      </div>

                    </form>
                  )}

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
