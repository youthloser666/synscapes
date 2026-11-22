import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="frosted-glass p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-300 w-full h-full">
      <div>
        {/* Scaled & Responsive Section Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight text-white mb-4 sm:mb-6 leading-[1.08]">
          MORE THAN MUSIC.
        </h2>

        {/* Responsive Section Manifesto */}
        <p className="text-xs sm:text-sm md:text-base lg:text-xl text-zinc-300 leading-relaxed font-sans font-light mb-6 sm:mb-8 max-w-2xl">
          Synescape brings together electronic music, visual experimentation and contemporary
          artistic practices to create shared cultural experiences.
        </p>

        {/* Prominent Touch-Friendly CTA Button */}
        <a
          href="#community"
          className="inline-flex items-center justify-center gap-2.5 border border-white/30 hover:border-white bg-white/5 hover:bg-white/10 text-white font-mono text-xs sm:text-sm tracking-widest px-5 sm:px-6 py-3 sm:py-3.5 uppercase transition-all duration-300 group min-h-[44px]"
        >
          <span>DISCOVER SYNESCAPE</span>
          <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* 
        Responsive 3-Block Media Grid:
        Fluid heights adapting gracefully across mobile, tablet, and desktop
      */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 mt-8 sm:mt-10 lg:mt-12">
        <div className="col-span-2 h-44 sm:h-56 md:h-64 lg:h-80 bg-[#cfd2d6] border border-white/10 overflow-hidden shadow-inner" />
        <div className="h-32 sm:h-40 md:h-48 lg:h-60 bg-[#cfd2d6] border border-white/10 overflow-hidden shadow-inner" />
        <div className="h-32 sm:h-40 md:h-48 lg:h-60 bg-[#cfd2d6] border border-white/10 overflow-hidden shadow-inner" />
      </div>
    </div>
  );
}
