import React, { useState, useEffect } from 'react';
import { Menu, Instagram, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll helper supporting both mobile container and desktop window scroll
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const scroller = document.querySelector('.app-viewport-scroller');
      if (scroller && window.innerWidth < 1024) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      {/* Click-outside backdrop overlay with fade */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      {/* 
        Top-Right Navigation Container:
        - Hamburger button stays permanently anchored in the top-right
        - When clicked, button turns white with a circular background
        - Staggered monochrome pill items appear directly beneath without overlapping the button
      */}
      <header className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 flex flex-col items-end pointer-events-none">
        {/* Permanent Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={`pointer-events-auto w-11 h-11 flex items-center justify-center transition-all duration-300 focus:outline-none shadow-none ${
            isOpen
              ? 'rounded-full bg-white text-black'
              : 'text-black hover:text-black/70 active:scale-95'
          }`}
        >
          <Menu className={`w-7 h-7 sm:w-8 sm:h-8 ${isOpen ? 'text-black' : 'text-black'}`} />
        </button>

        {/* 
          Floating Staggered Pill Cluster:
          - Pure black background with subtle white border
          - Zero shadow
          - Fades in and out smoothly with Framer Motion
        */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mt-3 flex flex-col items-end gap-2 max-w-[92vw]"
            >
              {/* Row 1: Primary Action */}
              <div className="flex items-center gap-2">
                <a
                  href="#events"
                  onClick={(e) => handleNavClick(e, '#events')}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white font-sans font-bold text-xs sm:text-sm tracking-wide shadow-none active:scale-95 transition-all duration-200 min-h-[38px] flex items-center"
                >
                  Reserve Pass
                </a>
              </div>

              {/* Row 2: Secondary Section Pills */}
              <div className="flex flex-wrap justify-end items-center gap-2">
                <a
                  href="#community"
                  onClick={(e) => handleNavClick(e, '#community')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white font-sans font-bold text-xs sm:text-sm tracking-wide shadow-none active:scale-95 transition-all duration-200 min-h-[38px] flex items-center"
                >
                  Community
                </a>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, '#about')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white font-sans font-bold text-xs sm:text-sm tracking-wide shadow-none active:scale-95 transition-all duration-200 min-h-[38px] flex items-center"
                >
                  About
                </a>
                <a
                  href="#archive"
                  onClick={(e) => handleNavClick(e, '#archive')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white font-sans font-bold text-xs sm:text-sm tracking-wide shadow-none active:scale-95 transition-all duration-200 min-h-[38px] flex items-center"
                >
                  Archive
                </a>
              </div>

              {/* Row 3: Event Session Pill */}
              <div className="flex justify-end items-center gap-2">
                <a
                  href="#events"
                  onClick={(e) => handleNavClick(e, '#events')}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white font-sans font-bold text-xs sm:text-sm tracking-wide shadow-none active:scale-95 transition-all duration-200 min-h-[38px] flex items-center"
                >
                  Synescape Session III
                </a>
              </div>

              {/* Row 4: Subscribe & Social Icon Circular Pills */}
              <div className="flex items-center gap-2">
                <a
                  href="#connect"
                  onClick={(e) => handleNavClick(e, '#connect')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white font-sans font-bold text-xs sm:text-sm tracking-wide shadow-none active:scale-95 transition-all duration-200 min-h-[38px] flex items-center"
                >
                  Subscribe
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white flex items-center justify-center shadow-none active:scale-95 transition-all duration-200"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </a>
                <a
                  href="mailto:contact@synscape.art"
                  aria-label="Contact Email"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black border border-white/25 hover:bg-white hover:text-black text-white flex items-center justify-center shadow-none active:scale-95 transition-all duration-200"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
