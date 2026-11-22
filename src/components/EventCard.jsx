import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function EventCard({ event }) {
  const currentEvent = event || {
    sessionCode: 'UPCOMING EVENT / 001',
    title: 'SYNESCAPE SESSION III',
    dateText: 'SAT. DEC 12 2026',
    location: 'BELGRADE, RS',
    bannerUrl: '/banner.png',
    ticketUrl: '#'
  };

  return (
    <div className="frosted-glass border border-white/10 flex flex-col md:flex-row overflow-hidden hover:border-white/20 transition-all duration-300 w-full h-full">
      {/* 
        Vertical Rotated Left Border Tab (Visible on Tablet & Desktop)
      */}
      <div className="hidden md:flex flex-col justify-between items-center py-6 lg:py-8 px-4 lg:px-5 border-r border-white/10 bg-black/45 flex-shrink-0">
        <span className="writing-mode-vertical font-mono text-xs sm:text-sm tracking-[0.3em] text-white/70 uppercase">
          {currentEvent.sessionCode}
        </span>
        <a
          href={currentEvent.ticketUrl}
          target="_blank"
          rel="noreferrer"
          className="writing-mode-vertical font-mono text-xs sm:text-sm tracking-widest text-white hover:text-white/70 transition-colors flex items-center gap-2 min-h-[44px]"
        >
          <span>GET TICKET</span>
          <ArrowUpRight className="w-4 h-4 rotate-90" />
        </a>
      </div>

      {/* Main Content & Responsive Poster Area */}
      <div className="p-6 sm:p-8 md:p-10 lg:p-14 flex-1 flex flex-col justify-between">
        <div>
          {/* Mobile-only Header */}
          <div className="md:hidden flex justify-between items-center mb-4 text-xs font-mono text-white/60 pb-3 border-b border-white/10">
            <span className="tracking-wider">{currentEvent.sessionCode}</span>
            <a href={currentEvent.ticketUrl} className="text-white hover:underline flex items-center gap-1.5 min-h-[36px] py-1 font-bold">
              GET TICKET <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight text-white mb-2 sm:mb-2.5 uppercase leading-[1.08]">
            {currentEvent.title}
          </h3>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm md:text-base font-mono tracking-wider text-zinc-400 mb-6 sm:mb-8">
            <span>{currentEvent.dateText}</span>
            <span>&bull;</span>
            <span>{currentEvent.location}</span>
          </div>
        </div>

        {/* Responsive Poster Container featuring banner.png */}
        <div className="relative border border-white/10 bg-black/60 overflow-hidden group shadow-2xl">
          <img
            src={currentEvent.bannerUrl || '/banner.png'}
            alt="Synescape Session III Poster"
            className="w-full h-auto object-cover max-h-[420px] sm:max-h-[520px] md:max-h-[620px] lg:max-h-[720px] filter brightness-95 group-hover:brightness-105 transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
}
