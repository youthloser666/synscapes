import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Community({ artists }) {
  const djs = artists?.djs || [
    { id: '1', name: 'NAME', city: 'City', genre: 'Genre' },
    { id: '2', name: 'NAME', city: 'City', genre: 'Genre' },
    { id: '3', name: 'NAME', city: 'City', genre: 'Genre' },
    { id: '4', name: 'NAME', city: 'City', genre: 'Genre' }
  ];

  const visualArtists = artists?.visualArtists || [
    { id: '5', name: 'NAME', city: 'City', genre: 'Genre' },
    { id: '6', name: 'NAME', city: 'City', genre: 'Genre' },
    { id: '7', name: 'NAME', city: 'City', genre: 'Genre' },
    { id: '8', name: 'NAME', city: 'City', genre: 'Genre' }
  ];

  return (
    <section id="community" className="frosted-glass border border-white/10 p-6 sm:p-8 md:p-12 lg:p-16 my-10 sm:my-16 w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-5 sm:pb-8 border-b border-white/10 mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-display font-normal tracking-wider text-white uppercase">
          COMMUNITY
        </h2>
        <a
          href="#community"
          className="inline-flex items-center gap-1.5 sm:gap-2 border border-white/30 hover:border-white px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-mono tracking-widest text-white/80 hover:text-white transition-colors min-h-[38px]"
        >
          <span>VIEW ALL</span>
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>

      {/* Row 1: DJs */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-14 mb-8 sm:mb-12 pb-8 sm:pb-10 border-b border-white/5">
        <div className="w-full md:w-28 lg:w-36 flex-shrink-0">
          <span className="text-base sm:text-lg md:text-2xl font-display font-normal text-white tracking-wide">
            DJs
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8 md:gap-12 w-full">
          {djs.map((artist) => (
            <div key={artist.id} className="flex flex-col items-center text-center group cursor-pointer">
              {/* Responsive Circular Node */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full bg-[#e5e7eb] mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md" />
              <span className="font-display font-normal text-xs sm:text-sm md:text-base lg:text-lg tracking-wider text-white uppercase">
                {artist.name}
              </span>
              <span className="font-mono text-[11px] sm:text-xs md:text-sm text-zinc-400 mt-0.5 sm:mt-1">{artist.city}</span>
              <span className="font-mono text-[10px] sm:text-[11px] md:text-xs text-zinc-500">{artist.genre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Visual Artists */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-14">
        <div className="w-full md:w-28 lg:w-36 flex-shrink-0">
          <span className="text-base sm:text-lg md:text-2xl font-display font-normal text-white tracking-wide leading-tight">
            Visual Artists
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8 md:gap-12 w-full">
          {visualArtists.map((artist) => (
            <div key={artist.id} className="flex flex-col items-center text-center group cursor-pointer">
              {/* Responsive Circular Node */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full bg-[#e5e7eb] mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md" />
              <span className="font-display font-normal text-xs sm:text-sm md:text-base lg:text-lg tracking-wider text-white uppercase">
                {artist.name}
              </span>
              <span className="font-mono text-[11px] sm:text-xs md:text-sm text-zinc-400 mt-0.5 sm:mt-1">{artist.city}</span>
              <span className="font-mono text-[10px] sm:text-[11px] md:text-xs text-zinc-500">{artist.genre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
