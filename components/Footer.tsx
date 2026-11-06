import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 text-stone-300 pt-20 pb-12 border-t border-obsidian-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-obsidian-800">
          
          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/">
              <img 
                src="/assets/logo/logo-white.svg" 
                alt="North Bengal Handmade Products BD" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-stone-400 text-xs leading-relaxed pt-2">
              <strong>"Ethically Handmade | Naturally Beautiful | Certified for Global Standards"</strong>
            </p>
            <p className="text-stone-400 text-xs leading-relaxed">
              Exporting handmade excellence from Northern Bangladesh since 2011. Direct manufacturers of wild Kaisa grass storage baskets, coiled seagrass hampers, braided golden jute planters, and sustainable lifestyle carry goods.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 font-semibold border border-emerald-500/30 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Bangladesh Exporter
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link href="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-amber-400 transition">About Our Story</Link></li>
              <li><Link href="/gallery" className="text-amber-300 font-bold hover:text-white transition">✨ Product Gallery (52)</Link></li>
              <li><Link href="/products" className="hover:text-amber-400 transition">Catalog Highlights</Link></li>
              <li><Link href="/sustainability" className="hover:text-amber-400 transition">Artisan & ESG</Link></li>
              <li><Link href="/certifications" className="hover:text-amber-400 transition">Certificates & Compliance</Link></li>
              <li><Link href="/export-guide" className="hover:text-amber-400 transition">Export & Freight Guide</Link></li>
              <li><Link href="/company-profile" className="hover:text-amber-400 transition">Executive Dossier</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition">Contact & RFQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Factory Catalog</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link href="/products/kaisa-grass-deep-storage-baskets" className="hover:text-amber-400 transition">Kaisa Grass Deep Baskets</Link></li>
              <li><Link href="/products/seagrass-cylindrical-hampers-bowls" className="hover:text-amber-400 transition">Seagrass Hampers & Bowls</Link></li>
              <li><Link href="/products/braided-jute-tapered-planter" className="hover:text-amber-400 transition">Braided Jute Tapered Planter</Link></li>
              <li><Link href="/products/kaisa-grass-low-shelf-trays" className="hover:text-amber-400 transition">Kaisa Grass Shelf Trays</Link></li>
              <li><Link href="/products/two-tone-cotton-rope-storage-baskets" className="hover:text-amber-400 transition">Two-Tone Cotton Rope Baskets</Link></li>
              <li><Link href="/products/handcrafted-seagrass-market-tote" className="hover:text-amber-400 transition">Seagrass & Jute Market Totes</Link></li>
            </ul>
          </div>

          {/* Column 4: Dual Operations */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Dual Hubs</h4>
            <div className="space-y-3 text-stone-400">
              <div>
                <strong className="text-amber-300 block">Corporate Liaison Office:</strong>
                <p>House No. 08, Road No. 08, Sector-06, Uttara PS, Dhaka-1230, Bangladesh</p>
              </div>
              <div>
                <strong className="text-emerald-300 block">Manufacturing Center:</strong>
                <p>Sarai, Lalbagh, Kaunia, Rangpur-5440, Bangladesh</p>
              </div>
              <div className="pt-1">
                <p>Direct: <a href="tel:+8801740305936" className="text-white hover:text-amber-400 font-mono">+880 1740-305936</a></p>
                <p>Partners: <span className="text-stone-300">Md. Mostaq Ahmed & Md. Abdullah Al Mamun</span></p>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Regulatory Details */}
        <div className="py-6 border-b border-obsidian-850 flex flex-wrap items-center justify-between gap-4 text-[11px] text-stone-400">
          <div className="flex items-center gap-6 flex-wrap">
            <span>Govt ERC: <strong className="text-amber-300 font-mono">260326211291422</strong></span>
            <span>NBR VAT/BIN: <strong className="text-emerald-300 font-mono">004681231-0102</strong></span>
            <span>e-TIN: <strong className="text-blue-300 font-mono">465746253246</strong></span>
            <span>Trade Lic: <strong className="text-purple-300 font-mono">No. 147</strong></span>
          </div>
          <div>
            <span>Nominated Bank: <strong className="text-stone-200">Agrani Bank Ltd., Gazipur Corporate Branch</strong></span>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © 2011–2026 <strong>North Bengal Handmade Products BD</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/company-profile" className="hover:text-stone-300 transition">Dossier PDF</Link>
            <span>•</span>
            <Link href="/certifications" className="hover:text-stone-300 transition">Certificates</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-stone-300 transition">Export Inquiries</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
