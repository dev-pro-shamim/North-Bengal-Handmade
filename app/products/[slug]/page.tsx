'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, PRODUCTS } from '@/lib/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Gallery active image
  const [activeImage, setActiveImage] = useState(product.heroImage);

  // Custom Quote Form State
  const [selectedSize, setSelectedSize] = useState(product.customizationOptions.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.customizationOptions.colors[0]);
  const [selectedBranding, setSelectedBranding] = useState(product.customizationOptions.branding[0]);
  const [customDimensions, setCustomDimensions] = useState('');
  const [quantity, setQuantity] = useState(product.specs.moq.split(' ')[0] || '100');
  const [incoterm, setIncoterm] = useState('FOB Chittagong (BDCGP)');
  const [destination, setDestination] = useState('');
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<{ ref: string; message: string } | null>(null);

  const handleCustomQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        productTitle: product.title,
        productSlug: product.slug,
        selectedSize: selectedSize === 'Bespoke Custom Size' ? `Custom: ${customDimensions}` : selectedSize,
        selectedColor,
        selectedBranding,
        quantity,
        incoterm,
        destination,
        buyerName,
        buyerCompany,
        buyerEmail,
        buyerPhone,
        specialNotes
      };

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setQuoteSuccess({
          ref: data.reference,
          message: data.message
        });
      } else {
        alert(data.error || 'Failed to submit quote request.');
      }
    } catch (err) {
      alert('Error submitting custom quote request. Please reach us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp instant link with pre-filled message
  const whatsappMessage = encodeURIComponent(
    `Hello North Bengal Handmade Products BD,\n\nI am inquiring about a custom export quote for:\n*${product.title}*\n\n` +
    `• Target Quantity: ${quantity}\n` +
    `• Selected Size: ${selectedSize}\n` +
    `• Color/Dye: ${selectedColor}\n` +
    `• Branding: ${selectedBranding}\n` +
    `• Preferred Term: ${incoterm}\n` +
    `• Destination Port: ${destination || 'To be specified'}\n\n` +
    `Please provide commercial FOB pricing and sample availability.`
  );

  return (
    <div className="font-sans antialiased text-stone-800 bg-linen-50 min-h-screen flex flex-col justify-between">
      
      <Navbar />

      {/* Breadcrumb Strip */}
      <div className="bg-linen-100 border-b border-stone-200 py-3 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-stone-900">Products Catalog</Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">{product.title}</span>
        </div>
      </div>

      {/* Main Product Showcase & Custom Quote Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (5 Cols): Image Gallery & Certifications Badge */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Stage Image */}
            <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-xl relative">
              <img 
                src={activeImage} 
                alt={product.title} 
                className="w-full h-[440px] object-cover"
              />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow">
                {product.badge}
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${activeImage === img ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-stone-200 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}

            {/* Compliance Guarantee Card */}
            <div className="p-6 rounded-3xl bg-obsidian-900 text-white border border-obsidian-750 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img src="/assets/logo/logo-badge.svg" alt="Official Seal" className="w-12 h-12 object-contain"/>
                <div>
                  <div className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">Manufacturer Guarantee</div>
                  <h5 className="font-bold text-white text-sm">North Bengal Handmade Products BD</h5>
                </div>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed">
                Direct export shipment from our certified artisan facilities in Kaunia, Rangpur. Full documentation provided: Commercial Invoice, Packing List, Certificate of Origin, Phytosanitary & Fumigation Certificate.
              </p>
              <div className="pt-2 border-t border-obsidian-800 flex justify-between text-[11px] text-stone-400 font-mono">
                <span>ERC: 260326211291422</span>
                <span>Bank: Agrani Bank Ltd.</span>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Product Details & Interactive Custom Quote Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Title & Category Header */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                {product.title}
              </h1>
              <p className="text-sm font-medium text-amber-700 mt-1">
                {product.subtitle}
              </p>
              <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider text-amber-900">
                Craft Quality Highlights
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications Table */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center justify-between">
                <span>Technical Specifications & Export Details</span>
                <span className="text-xs font-mono text-emerald-700 font-semibold">AQL 2.5 Standard</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-linen-100 border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Fiber Material</span>
                  <strong className="text-stone-900 text-xs">{product.specs.material}</strong>
                </div>
                <div className="p-3 rounded-xl bg-linen-100 border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Weight / GSM</span>
                  <strong className="text-stone-900 text-xs">{product.specs.weightGsm}</strong>
                </div>
                <div className="p-3 rounded-xl bg-linen-100 border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Minimum Order (MOQ)</span>
                  <strong className="text-stone-900 text-xs">{product.specs.moq}</strong>
                </div>
                <div className="p-3 rounded-xl bg-linen-100 border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Production Lead Time</span>
                  <strong className="text-stone-900 text-xs">{product.specs.productionLeadTime}</strong>
                </div>
                <div className="p-3 rounded-xl bg-linen-100 border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Sampling Turnaround</span>
                  <strong className="text-stone-900 text-xs">{product.specs.samplingTime}</strong>
                </div>
                <div className="p-3 rounded-xl bg-linen-100 border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Port of Dispatch</span>
                  <strong className="text-stone-900 text-xs">{product.specs.portOfDispatch}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Export Packaging:</strong> {product.specs.exportPackaging}
              </div>
            </div>

            {/* INTERACTIVE CUSTOM QUOTE FORM (INDIVIDUAL PRODUCT) */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-400/80 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded">
                    Direct Manufacturer Inquiry
                  </span>
                  <h3 className="text-2xl font-extrabold text-stone-900 mt-1">
                    Request Custom Quote for This Item
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Specify your target dimensions, colors, private branding, and destination seaport.
                  </p>
                </div>
                <a 
                  href={`https://wa.me/8801740305936?text=${whatsappMessage}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  <span>WhatsApp Quote</span>
                </a>
              </div>

              <form onSubmit={handleCustomQuoteSubmit} className="space-y-5 text-xs">
                
                {/* 1. Dimension / Size Selection */}
                <div>
                  <label className="block font-bold text-stone-800 uppercase mb-2">
                    1. Choose Dimension / Sizing *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.customizationOptions.sizes.map(size => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 rounded-xl text-left border text-xs font-medium transition ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white font-bold' : 'border-stone-300 bg-linen-50 text-stone-700 hover:bg-stone-100'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {selectedSize === 'Bespoke Custom Size' && (
                    <div className="mt-2">
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your exact custom dimensions (e.g. 240 x 300 cm / 8x10 ft)..." 
                        value={customDimensions} 
                        onChange={e => setCustomDimensions(e.target.value)} 
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-amber-400 bg-amber-50/50 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Color / Dye Selection */}
                <div>
                  <label className="block font-bold text-stone-800 uppercase mb-2">
                    2. Select Color / Dye Formulation *
                  </label>
                  <select 
                    value={selectedColor} 
                    onChange={e => setSelectedColor(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                  >
                    {product.customizationOptions.colors.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Branding & Labeling */}
                <div>
                  <label className="block font-bold text-stone-800 uppercase mb-2">
                    3. OEM Private Label & Packaging *
                  </label>
                  <select 
                    value={selectedBranding} 
                    onChange={e => setSelectedBranding(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                  >
                    {product.customizationOptions.branding.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Quantity & Commercial Incoterm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 uppercase mb-1">
                      Required Quantity (Units) *
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={quantity} 
                      onChange={e => setQuantity(e.target.value)} 
                      placeholder="e.g. 100 pcs or Sample Run" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">MOQ: {product.specs.moq}</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 uppercase mb-1">
                      Preferred Incoterm *
                    </label>
                    <select 
                      value={incoterm} 
                      onChange={e => setIncoterm(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                    >
                      <option>FOB Chittagong (BDCGP)</option>
                      <option>CIF (Cost, Insurance & Freight)</option>
                      <option>CFR (Cost & Freight)</option>
                      <option>EXW (Ex-Works Factory)</option>
                      <option>Air Express (Courier Sampling)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Destination Seaport / Airport */}
                <div>
                  <label className="block font-bold text-stone-800 uppercase mb-1">
                    Destination Seaport / Country *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)} 
                    placeholder="e.g. Port of Rotterdam / Hamburg / Los Angeles" 
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>

                {/* 6. Buyer Contact Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                  <div>
                    <label className="block font-bold text-stone-800 uppercase mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={buyerName} 
                      onChange={e => setBuyerName(e.target.value)} 
                      placeholder="e.g. Marcus Vance" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 uppercase mb-1">Company / Retail Brand *</label>
                    <input 
                      type="text" 
                      required 
                      value={buyerCompany} 
                      onChange={e => setBuyerCompany(e.target.value)} 
                      placeholder="e.g. Scandinavian Living Ltd." 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 uppercase mb-1">Business Email *</label>
                    <input 
                      type="email" 
                      required 
                      value={buyerEmail} 
                      onChange={e => setBuyerEmail(e.target.value)} 
                      placeholder="buyer@brand.com" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 uppercase mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      required 
                      value={buyerPhone} 
                      onChange={e => setBuyerPhone(e.target.value)} 
                      placeholder="+1 555 123 4567" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 uppercase mb-1">Additional Tech-Pack / Notes</label>
                  <textarea 
                    rows={3} 
                    value={specialNotes} 
                    onChange={e => setSpecialNotes(e.target.value)} 
                    placeholder="Provide any custom weaving instructions, barcode hangtag specifications, or target delivery deadlines..." 
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full sm:flex-1 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg"
                  >
                    {submitting ? 'Transmitting Custom Quote...' : 'Submit Custom Quote Request →'}
                  </button>

                  <a 
                    href={`https://wa.me/8801740305936?text=${whatsappMessage}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition text-center shadow"
                  >
                    Quote via WhatsApp 💬
                  </a>
                </div>

              </form>

              {/* Confirmation Alert */}
              {quoteSuccess && (
                <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs space-y-2">
                  <div className="font-bold text-sm text-emerald-900">
                    ✓ Custom Quote Requisition Dispatched!
                  </div>
                  <div>
                    Requisition Ref: <strong className="font-mono text-sm">{quoteSuccess.ref}</strong>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    Our commercial export desk in Sector-06 Uttara, Dhaka has received your custom quote request for <strong>{product.title}</strong>. An export officer will generate your formal proforma price breakdown and email you within 12 business hours.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Other Handcrafted Collections Navigation */}
        <div className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-stone-900">Other Handcrafted Export Collections</h3>
              <p className="text-xs text-stone-500 mt-1">Explore our range of traditional Shatranji, jute rugs, and eco baskets.</p>
            </div>
            <Link href="/#collections" className="text-xs font-bold text-amber-800 hover:underline">
              View All 6 Collections →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRODUCTS.filter(p => p.slug !== product.slug).slice(0, 3).map(other => (
              <Link 
                key={other.slug} 
                href={`/products/${other.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-xl transition group p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 rounded-2xl overflow-hidden mb-3">
                    <img src={other.heroImage} alt={other.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <div className="text-[10px] font-bold uppercase text-amber-800">{other.category}</div>
                  <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-700 transition mt-0.5">{other.title}</h4>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>MOQ: {other.specs.moq.split(' ')[0]} pcs</span>
                  <span className="text-amber-800">Custom Quote →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
