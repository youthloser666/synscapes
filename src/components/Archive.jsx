import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Archive({ archiveData }) {
  const archive = archiveData || {
    title: 'SYNESCAPE SESSION 001',
    sessionCode: 'SESSION 001',
    recordingDate: '01 Sept / BELGRADE / 2024',
    description: 'WATCH SESSION'
  };

  return (
    /* 
      Responsive Archive Container:
      Full width on mobile/tablet, offset width (lg:w-[75%] xl:w-[70%]) on large displays
    */
    <div id="archive" className="frosted-glass border border-white/10 p-6 sm:p-8 md:p-10 lg:p-14 mt-10 sm:mt-16 mb-6 sm:mb-8 w-full lg:w-[75%] xl:w-[70%]">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-display font-normal tracking-wider text-white uppercase">
          AUDIOVISUAL ARCHIVE
        </h2>
        {/* Mobile-only action button */}
        <a
          href="#archive"
          className="md:hidden inline-flex items-center gap-1 text-[11px] font-mono tracking-widest text-white/80 hover:text-white"
        >
          <span>VIEW</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      <div className="relative flex flex-col md:flex-row gap-4 sm:gap-5">
        {/* Responsive Video Placeholder Viewport */}
        <div className="relative w-full h-52 sm:h-72 md:h-[460px] lg:h-[580px] bg-[#e5e7eb] flex items-center justify-center overflow-hidden shadow-inner">
          <span className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-widest text-[#9ca3af] select-none">
            VIDEO
          </span>
        </div>

        {/* Vertical Badge Tab (Visible on Tablet and Desktop) */}
        <div className="hidden md:flex flex-col justify-between items-center py-6 px-4 border-l border-white/10 bg-black/45 flex-shrink-0">
          <span className="writing-mode-vertical font-mono text-xs sm:text-sm tracking-[0.25em] text-white/70 uppercase">
            SELECTED WORKS
          </span>
          <a
            href="#archive"
            className="writing-mode-vertical font-mono text-xs sm:text-sm tracking-widest text-white hover:text-white/70 transition-colors flex items-center gap-2 min-h-[44px]"
          >
            <span>VIEW VIDEOS</span>
            <ArrowUpRight className="w-3.5 h-3.5 rotate-90" />
          </a>
        </div>
      </div>

      {/* Responsive Bottom Metadata Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-white/10 text-xs sm:text-sm md:text-base font-mono text-zinc-400 gap-2 sm:gap-3">
        <span className="font-bold text-white tracking-widest uppercase">{archive.title}</span>
        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs md:text-sm">
          <span>{archive.recordingDate}</span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white inline-block" />
          <span>{archive.description}</span>
        </div>
      </div>
    </div>
  );
}
