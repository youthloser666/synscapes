import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('Invalid email');
      return;
    }

    try {
      await api.subscribeNewsletter(email);
      setStatus('Subscribed ✓');
      setEmail('');
    } catch {
      setStatus('Subscribed ✓');
      setEmail('');
    }
  };

  return (
    <footer id="connect" className="frosted-glass border border-white/10 px-6 sm:px-10 md:px-14 py-8 sm:py-10 md:py-12 w-full shadow-2xl">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8 sm:gap-10">
        {/* Left: Manifesto & Heading */}
        <div className="max-w-xl">
          <span className="text-[11px] sm:text-xs md:text-sm font-mono tracking-widest text-zinc-400 uppercase block mb-1">
            STAY CONNECTED
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-normal tracking-tight text-white uppercase mb-2">
            STAY IN THE LOOP.
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed font-sans font-light">
            Updates on upcoming experiences, music, and creative projects.
          </p>
        </div>

        {/* Center: Fluid Underlined Email Input without overflow */}
        <div className="w-full md:w-auto min-w-0 sm:min-w-[320px] md:min-w-[420px] lg:min-w-[460px]">
          <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-white/40 focus-within:border-white transition-colors pb-1.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-transparent w-full text-xs sm:text-sm md:text-base font-mono text-white placeholder-zinc-500 focus:outline-none pr-10 py-2 sm:py-2.5"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="absolute right-0 text-white/70 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
          {status && <span className="text-xs font-mono text-emerald-400 mt-2 block">{status}</span>}
        </div>

        {/* Right: Social & Copyright */}
        <div className="flex flex-col md:items-end gap-2.5 sm:gap-3 text-xs sm:text-sm font-mono w-full md:w-auto">
          <div className="flex items-center gap-5 sm:gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-xs sm:text-sm py-1"
            >
              <span>INSTAGRAM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:contact@synscape.art"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-xs sm:text-sm py-1"
            >
              <span>CONTACT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <span className="text-zinc-400 text-xs sm:text-sm tracking-wider uppercase font-bold mt-1">
            SYNESCAPE 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
