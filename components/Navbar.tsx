'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Gallery (52)', href: '/gallery' },
    { label: 'Artisan & ESG', href: '/sustainability' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Export Guide', href: '/export-guide' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <>
      {/* 1. TOP STATUTORY VERIFICATION BAR */}
      <div className="bg-obsidian-950 text-stone-300 text-xs py-2 px-4 border-b border-obsidian-850 relative z-50">
        <div className="w-full max-w-[1536px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Verified Exporter of Bangladesh
            </span>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span>ERC: <strong className="text-amber-400 font-mono">260326211291422</strong></span>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span>BIN: <strong className="text-amber-400 font-mono">004681231-0102</strong></span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <a href="tel:+8801740305936" className="text-stone-300 hover:text-amber-400 transition flex items-center gap-1.5 whitespace-nowrap">
              <span>📞 +880 1740-305936</span>
            </a>
            <a 
              href="https://wa.me/8801740305936?text=Hello%20North%20Bengal%20Handmade%2C%20I%20would%20like%20to%20inquire%20about%20your%20export%20products." 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-semibold whitespace-nowrap"
            >
              <span>💬 WhatsApp Desk</span>
            </a>
            <Link href="/company-profile" className="text-amber-300 hover:text-white transition flex items-center gap-1 font-medium hidden sm:flex whitespace-nowrap">
              <span>📄 Corporate Dossier</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STICKY MAIN NAVIGATION */}
      <header className="sticky top-0 z-40 bg-obsidian-900/95 backdrop-blur-xl border-b border-obsidian-750 shadow-xl transition-all duration-300">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img 
                src="/assets/logo/logo-white.svg" 
                alt="North Bengal Handmade Products BD Logo" 
                className="h-10 sm:h-11 w-auto max-w-[240px] sm:max-w-[280px] object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation (Single Line Guaranteed with whitespace-nowrap) */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6 text-[11px] xl:text-xs font-semibold uppercase tracking-wider text-stone-300 shrink-0">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`whitespace-nowrap py-1 border-b-2 transition-colors shrink-0 ${
                      isActive 
                        ? 'text-amber-400 border-amber-400 font-bold' 
                        : 'border-transparent hover:text-amber-400 hover:border-amber-400/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Buttons (Single Line Guaranteed with whitespace-nowrap) */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <Link 
                href="/gallery" 
                className="whitespace-nowrap px-3.5 py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-500/40 hover:bg-amber-500/10 transition shrink-0"
              >
                Gallery (52)
              </Link>

              <Link 
                href="/contact" 
                className="whitespace-nowrap px-4 py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow transition shrink-0"
              >
                Custom Quote →
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 rounded-lg text-stone-200 hover:text-white hover:bg-obsidian-800 transition"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-obsidian-950 border-b border-obsidian-700 px-6 py-6 space-y-3">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm border-b border-obsidian-850 ${
                    isActive ? 'text-amber-400 font-bold' : 'text-stone-300 hover:text-amber-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2">
              <Link 
                href="/gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase"
              >
                Browse 52 Export Products Gallery
              </Link>
              <Link 
                href="/company-profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-amber-500/50 text-amber-300 font-bold text-xs uppercase"
              >
                📄 Corporate Dossier (Printable)
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
