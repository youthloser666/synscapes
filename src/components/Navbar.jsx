import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'EVENTS', href: '#events' },
    { label: 'COMMUNITY', href: '#community' },
    { label: 'ARCHIVE', href: '#archive' },
    { label: 'CONNECT', href: '#connect' },
  ];

  return (
    <>
      {/* 
        Top Header matching Image 1:
        Only the minimalist hamburger menu icon in the top right, clean and responsive across all screen sizes.
      */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-4 sm:px-6 md:px-12 py-4 sm:py-6 pointer-events-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="pointer-events-auto p-2 sm:p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-white/70 active:scale-95 transition-all focus:outline-none"
        >
          {isOpen ? <X className="w-7 h-7 sm:w-8 sm:h-8" /> : <Menu className="w-7 h-7 sm:w-8 sm:h-8" />}
        </button>
      </header>

      {/* Slide-in Overlay Navigation Drawer with Responsive Touch Scrolling */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 md:p-16 animate-fadeIn overflow-y-auto max-h-screen">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="font-mono text-[11px] sm:text-xs tracking-widest text-white/50">NAVIGATION INDEX</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-xs tracking-widest font-mono p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              [CLOSE]
            </button>
          </div>

          <nav className="flex flex-col gap-5 sm:gap-7 md:gap-8 my-auto py-8">
            {navLinks.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between text-2xl sm:text-4xl md:text-6xl font-display font-normal tracking-tight text-white/80 hover:text-white hover:translate-x-2 sm:hover:translate-x-3 transition-all duration-300 py-1"
              >
                <span className="flex items-center">
                  <span className="text-[10px] sm:text-xs font-mono text-white/40 mr-3 sm:mr-4 font-normal">0{idx + 1}</span>
                  {item.label}
                </span>
                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </nav>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-white/10 text-[10px] sm:text-xs font-mono text-white/50 gap-2">
            <span>BELGRADE / BERLIN / TOKYO</span>
            <span>SYNESCAPE AUDIOVISUAL &bull; 2026</span>
          </div>
        </div>
      )}
    </>
  );
}
