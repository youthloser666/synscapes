import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

const CITY_COUNTRY_MAP = {
  Belgrade: 'RS',
  Berlin: 'DE',
  Vienna: 'AT',
  Tokyo: 'JP',
  London: 'GB',
  Amsterdam: 'NL',
  'New York': 'US',
  Melbourne: 'AU',
  Paris: 'FR'
};

// Preview card dimensions (must match CSS below)
const CARD_W = 240;
const CARD_H = 320;
const EDGE_PAD = 16; // min gap from viewport edge

export default function Community({ artists }) {
  const [activeArtist, setActiveArtist] = useState(null);
  const previewRef = useRef(null);
  const isTouchDevice = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });

  const djs = artists?.djs || [
    { id: '1', name: 'SAJAAK', city: 'Belgrade', genre: 'Dark Techno', roleType: 'DJ' },
    { id: '2', name: 'LU/STT', city: 'Berlin', genre: 'Industrial', roleType: 'DJ' },
    { id: '3', name: 'VOUG', city: 'Vienna', genre: 'Hypnotic Groove', roleType: 'DJ' },
    { id: '4', name: 'BYEDOV', city: 'Belgrade', genre: 'Modular Live', roleType: 'DJ' }
  ];

  const visualArtists = artists?.visualArtists || [
    { id: '5', name: 'YUKIYA', city: 'Tokyo', genre: 'Live Generative', roleType: 'VISUAL_ARTIST' },
    { id: '6', name: 'MANTRA', city: 'Belgrade', genre: 'Laser Installation', roleType: 'VISUAL_ARTIST' },
    { id: '7', name: 'SYNTHIA', city: 'London', genre: 'Audioreactive', roleType: 'VISUAL_ARTIST' },
    { id: '8', name: 'KINETIC', city: 'Amsterdam', genre: 'Scenography', roleType: 'VISUAL_ARTIST' }
  ];

  // Viewport-aware auto-flip: compute card position so it never clips edges
  const computeCardPosition = useCallback((cx, cy) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: prefer right of cursor, flip left if clipped
    let x = cx + 20;
    if (x + CARD_W + EDGE_PAD > vw) {
      x = cx - CARD_W - 20;
    }
    // Clamp horizontal
    x = Math.max(EDGE_PAD, Math.min(x, vw - CARD_W - EDGE_PAD));

    // Vertical: center on cursor, then clamp to viewport
    let y = cy - CARD_H / 2;
    y = Math.max(EDGE_PAD, Math.min(y, vh - CARD_H - EDGE_PAD));

    return { x, y };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isTouchDevice.current = window.matchMedia('(hover: none)').matches || ('ontouchstart' in window);
    }

    const preview = previewRef.current;
    if (!preview || isTouchDevice.current) return;

    // Initial hidden state
    gsap.set(preview, {
      x: 0,
      y: 0,
      scale: 0.85,
      autoAlpha: 0,
      pointerEvents: 'none'
    });

    // Smooth GSAP interpolation for position
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      const pos = computeCardPosition(e.clientX, e.clientY);
      xTo(pos.x);
      yTo(pos.y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [computeCardPosition]);

  const handleRowEnter = (artist) => {
    if (isTouchDevice.current) return;
    setActiveArtist(artist);

    if (previewRef.current) {
      // Snap to computed position instantly, then animate in
      const pos = computeCardPosition(mousePos.current.x, mousePos.current.y);
      gsap.set(previewRef.current, { x: pos.x, y: pos.y });

      gsap.to(previewRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  const handleRowLeave = () => {
    if (isTouchDevice.current) return;
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        autoAlpha: 0,
        scale: 0.85,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: 'auto'
      });
    }
  };

  const getCountryCode = (artist) => {
    if (artist.countryCode) return artist.countryCode;
    return CITY_COUNTRY_MAP[artist.city] || artist.city?.slice(0, 2).toUpperCase() || 'INTL';
  };

  return (
    <section
      id="community"
      onMouseLeave={handleRowLeave}
      className="frosted-glass border border-white/10 p-6 sm:p-8 md:p-12 lg:p-16 my-10 sm:my-16 w-full relative"
    >
      {/* Floating GSAP Cursor Tracking Preview — Simple Black Dummy */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 z-50 pointer-events-none overflow-hidden rounded-lg border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
        style={{
          width: CARD_W,
          height: CARD_H,
          willChange: 'transform, opacity'
        }}
      >
        {/* Clean black fill — dummy photo placeholder */}
        <div className="w-full h-full bg-black relative">
          {/* Minimal artist info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <h4 className="font-display text-sm text-white tracking-wide truncate uppercase">
              {activeArtist?.name || 'ARTIST'}
            </h4>
            <p className="font-mono text-[10px] text-zinc-400 tracking-wider truncate mt-0.5">
              {activeArtist?.city} · {activeArtist?.genre}
            </p>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex items-center justify-between pb-5 sm:pb-8 border-b border-white/10 mb-8 sm:mb-12">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase mb-1">
            ROSTER // COMMUNITY
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-display font-normal tracking-wider text-white uppercase">
            COMMUNITY
          </h2>
        </div>
        <a
          href="#community"
          className="inline-flex items-center gap-1.5 sm:gap-2 border border-white/30 hover:border-white px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-mono tracking-widest text-white/80 hover:text-white transition-colors min-h-[38px]"
        >
          <span>VIEW ALL</span>
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>

      {/* Two Categories: DJs vs Visual Artists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Category 1: DJs */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                Lineup:
              </span>
              <span className="font-display text-sm sm:text-base text-white tracking-wider uppercase">
                DJs
              </span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500 tracking-wider">
              [ 01 // AUDIO ]
            </span>
          </div>

          <div className="flex flex-col divide-y divide-white/10">
            {djs.map((artist) => (
              <div
                key={artist.id}
                onMouseEnter={() => handleRowEnter(artist)}
                onMouseLeave={handleRowLeave}
                className="group py-4 sm:py-5 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-white/[0.03] px-2 sm:px-3 -mx-2 sm:-mx-3 rounded"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 min-w-0">
                  <span className="font-display font-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-zinc-200 group-hover:text-white transition-colors tracking-tight uppercase group-hover:translate-x-1 duration-200 transform">
                    {artist.name}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider">
                    {artist.city} · {artist.genre}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="font-mono text-sm sm:text-base md:text-lg text-zinc-400 group-hover:text-white transition-colors tracking-widest font-semibold">
                    {getCountryCode(artist)}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category 2: Visual Artists */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                Lineup:
              </span>
              <span className="font-display text-sm sm:text-base text-white tracking-wider uppercase">
                Visual Artists
              </span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500 tracking-wider">
              [ 02 // VISUAL ]
            </span>
          </div>

          <div className="flex flex-col divide-y divide-white/10">
            {visualArtists.map((artist) => (
              <div
                key={artist.id}
                onMouseEnter={() => handleRowEnter(artist)}
                onMouseLeave={handleRowLeave}
                className="group py-4 sm:py-5 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-white/[0.03] px-2 sm:px-3 -mx-2 sm:-mx-3 rounded"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 min-w-0">
                  <span className="font-display font-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-zinc-200 group-hover:text-white transition-colors tracking-tight uppercase group-hover:translate-x-1 duration-200 transform">
                    {artist.name}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider">
                    {artist.city} · {artist.genre}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="font-mono text-sm sm:text-base md:text-lg text-zinc-400 group-hover:text-white transition-colors tracking-widest font-semibold">
                    {getCountryCode(artist)}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
